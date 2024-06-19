<script setup lang="ts">
import { createThreads, getThreadState, modifyThreads } from '@/api/api-gpt';
import { filterMsgs, mergeMessagesById, Message, useStreamState } from '@/hooks/useStreamState';
import { useIdsStore } from '@/stores/id';
import IconSend from '~icons/app/icon-send.svg'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import ChatItemContent from './ChatItemContent.vue';
import { sceneChatList, defaultChatList } from '@/data/chat';

const { threadId, assistantId } = useIdsStore();
const searchValue = ref('');
const disableInput = ref(false);
const ChatRef = ref();
const innerRef = ref();
const { startStream, stream } = useStreamState();

const allState = ref<Message[]>([])
const showAllState = computed(() => filterMsgs(allState.value));
const getState = (id: string) => {
  if (id) {
    getThreadState(id).then(res => {
      allState.value = res.values;
      disableInput.value = !!res.next.length;
      keepScrollBottom();
    })
  } else {
    allState.value = [];
    disableInput.value = false;
  }
}
const init = () => {
  getState(threadId.value);
}

const keepScrollBottom = () => {
  nextTick(() => {
    ChatRef.value?.setScrollTop(innerRef.value!.clientHeight);
  });
}

watch(
  () => stream.value,
  (stream) => {
    if (stream?.status === 'done') {
      disableInput.value = false;
      getState(threadId.value);
    } else if (stream?.status === 'inflight') {
      allState.value = mergeMessagesById(allState.value, stream.messages)
      keepScrollBottom();
    }
  }
)

const emits = defineEmits(['createThread'])
const sendReqFun = (value: string) => {
  disableInput.value = true;
    const id = `human-${Math.random()}`
    const input = [{
      content: value,
      additional_kwargs: {},
      type: 'human',
      example: false,
      id,
    }];
    startStream(input, threadId.value);
    searchValue.value = '';
}
const sendReq = (str?: string) => {
  const value = str || searchValue.value;
  if (value) {
    if (disableInput.value) return;
    // 如果没创建对话，就先创建对话再问答
    if (!threadId.value) {
      const param = {
        assistant_id: assistantId.value,
        name: value,
      }
      createThreads(param).then(res => {
        threadId.value = res.thread_id;
        emits('createThread');
        sendReqFun(value);
      });
    } else {
      // 如果是新创建对话，第一次搜索修改对话名称
      if (!allState.value.length) {
        modifyThreads(threadId.value, { name: value, assistant_id: assistantId.value }).then(() => {
          emits('createThread');
        })
      }
      sendReqFun(value);
    }
  }
}

// 回车发送
const enterSearch = (e) => {
  if (e.key === 'Enter' && searchValue.value) {
    sendReq();
  }
}

onMounted(() => {
  window.addEventListener('keydown', enterSearch)
})
onUnmounted(() => {
  window.removeEventListener('keydown', enterSearch)
})

defineExpose({
  init,
});
</script>
<template>
  <div class="qa-content" :class="{ 'no-state-content': !allState.length }">
    <div class="chat" v-if="allState.length">
      <el-scrollbar ref="ChatRef">
        <div ref="innerRef">
          <div v-for="(item) in showAllState" style="margin-bottom: 24px">
            <ChatItemContent :chat-item="item" @click-item="sendReq($event as string)"></ChatItemContent>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div v-else class="chat">
      <el-scrollbar ref="ChatRef">
        <div class="scene-chat">
          <h2>你好我是 openGauss小助手 很高兴为你服务</h2>
          <p class="desc"><span>场景问答： </span>可以基于以下场景进行提问，回复会更准确哦，点击查看问题样本</p>
          <div class="scene-list">
            <div v-for="item in sceneChatList" class="scene-list-item" @click="sendReq(item.value)">
              <img :src="item.img">
              {{ item.title }}
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="operate">
      <div class="default-chats" v-if="!allState.length">
        <div v-for="item in defaultChatList" class="default-chat-item" @click="sendReq(item)"> {{ item }} </div>
      </div>
    </div>
    <div class="send" :class="{ 'have-state': allState.length }">
      <OInput :disabled="disableInput" v-model="searchValue" maxlength="2000" placeholder="请输入你想了解的内容，按Enter发送">
        <template #suffix>
          <div class="send-icon" :class="disableInput && 'disableIcon'">
            <OIcon @click="sendReq()"><IconSend/></OIcon>
          </div>
        </template>
      </OInput>
    </div>
  </div>
  <div class="right" v-if="allState.length">
    <el-scrollbar>
      <div class="right-inner">
        <h3>场景问答</h3>
        <p>可以基于以下场景进行提问，回复会更准确哦，点击查看问题样本</p>
        <div v-for="item in sceneChatList" class="scene-list-item" @click="sendReq(item.value)">
          <img :src="item.img">
          {{ item.title }}
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<style lang="scss" scoped>
.no-state-content {
  margin-left: 108px;
  margin-right: 164px;
  @media screen and (max-width: 1800px) {
    margin-left: 32px;
    margin-right: 88px;
  }
  @media screen and (max-width: 1400px) {
    margin-left: 0px;
    margin-right: 56px;
  }
}
.qa-content {
  flex-grow: 1;
  .chat {
    height: calc(100vh - 256px);
  }

  .scene-chat {
    margin-top: 88px;
    background-color: #fff;
    padding: 32px;
    border-radius: 8px;
    @media screen and (max-width: 1800px) {
      margin-top: 48px;
    }
    @media screen and (max-width: 1400px) {
      margin-top: 16px;
    }
    h2 {
      font-size: 28px;
      line-height: 40px;
      color: var(--o-color-text1);
      margin-bottom: 24px;
      font-weight: 600;
    }
    .desc {
      font-size: 20px;
      line-height: 28px;
      color: var(--o-color-text1);
      margin-bottom: 24px;
      span {
        background-image: linear-gradient(270deg, #7d78ff, #7d32ea);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-weight: 600;
      }
    }
    .scene-list {
      display: grid;
      grid-template-columns: auto auto auto;
      gap: 24px;
      .scene-list-item {
        display: flex;
        align-items: center;
        column-gap: 6px;
        color: var(--o-color-text1);
        font-weight: 600;
        font-size: 20px;
        line-height: 28px;
        padding: 24px;
        background-color: #f4f5f7;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          background-color: #fff;
          box-shadow: 0 8px 40px 0 rgba(18, 20, 23, .1);
        }
        img {
          width: 50px;
          height: 50px;
        }
      }
    }
  }

  .operate {
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: end;
    .default-chats {
      display: flex;
      justify-content: end;
      column-gap: 12px;
      .default-chat-item {
        background-color: #fff;
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 16px;
        color: var(--o-color-text1);
        line-height: 24px;
        cursor: pointer;
        &:hover {
          color: var(--o-color-text2);
          background-image: linear-gradient(270deg, #7d78ff, #7d32ea);
        }
      }
    }
  }

  .send {
    display: flex;
    width: 100%;
    column-gap: 24px;
    .o-input {
      --o-input-border-color: none;
      --o-input-disabled-border-color: rgba(125, 50, 234, 0.4);
      height: 72px;
    }
    .send-icon {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      font-size: 19px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      background-color: #7d32ea;
      cursor: pointer;
    }
    .disableIcon {
      background-color: rgba(125, 50, 234, 0.4);
    }
  }
  .have-state {
    padding-left: 64px;
  }
}
.right {
  height: calc(100vh - 112px);
  width: 312px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 16px 0 rgba(25, 25, 25, 0.05);
  flex-shrink: 0;
  padding-top: 24px;
  padding-bottom: 24px;
  .right-inner {
    padding-left: 24px;
    padding-right: 24px;
  }
  h3 {
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 12px;
    font-weight: 600;
  }
  p {
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 24px;
  }
  .scene-list-item {
    display: flex;
    align-items: center;
    column-gap: 6px;
    color: var(--o-color-text1);
    font-size: 16px;
    line-height: 24px;
    padding: 7px 16px;
    background-color: #f4f5f7;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 16px;
    &:hover {
      background-color: #fff;
      box-shadow: 0 8px 40px 0 rgba(18, 20, 23, .1);
    }
    img {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
