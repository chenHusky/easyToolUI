<script setup lang="ts">
import { createThreads, getThreadState } from '@/api/api-gpt';
import { mergeMessagesById, Message, useStreamState } from '@/hooks/useStreamState';
import { useIdsStore } from '@/stores/id';
import IconSend from '~icons/app/icon-search.svg'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import ChatItemContent from './ChatItemContent.vue';
import { sceneChatList, defaultChatList } from '@/data/chat';

const { threadId, assistantId } = useIdsStore();
const searchValue = ref('');
const disableInput = ref(false);
const ChatRef = ref();
const { startStream, stream } = useStreamState();

const allState = ref<Message[]>([])
const getState = (id: string) => {
  if (id) {
    getThreadState(id).then(res => {
      const arr = mergeMessagesById(res.values, []);
      if (arr.length !== allState.value.length) {
        allState.value = arr;
      }
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
    ChatRef.value?.scrollTo({
      top: ChatRef.value?.scrollHeight,
      behavior: 'smooth',
    });
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
    <div class="chat" ref="ChatRef" v-if="allState.length">
      <div v-for="(item) in allState" style="margin-bottom: 24px">
        <ChatItemContent :chat-item="item"></ChatItemContent>
      </div>
    </div>
    <div v-else class="chat" ref="ChatRef">
      <div class="scene-chat">
        <h2>你好我是 openGauss小助手 很高兴为你服务</h2>
        <p class="desc"><span>场景问答： </span>可以基于以下场景进行提问，回复会更准确哦，点击查看问题样本</p>
        <div class="scene-list">
          <div v-for="item in sceneChatList" class="scene-list-item" @click="sendReq(item.title)">
            {{ item.title }}
          </div>
        </div>
      </div>
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
    <h3>场景问答</h3>
    <p>可以基于以下场景进行提问，回复会更准确哦，点击查看问题样本</p>
    <div v-for="item in sceneChatList" class="scene-list-item" @click="sendReq(item.title)">
      {{ item.title }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '@/shared/styles/mixin/common.scss' as *;
.no-state-content {
  margin-left: 108px;
  margin-right: 164px;
}
.qa-content {
  min-width: 1100px;
  flex-grow: 1;
  .chat {
    height: calc(100vh - 256px);
    overflow: auto;
    padding-right: 8px;
    @include scrollbar;
  }

  .scene-chat {
    margin-top: 88px;
    background-color: #fff;
    padding: 32px;
    border-radius: 8px;
    h2 {
      font-size: 28px;
      line-height: 40px;
      color: var(--o-color-text1);
      margin-bottom: 24px;
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
      }
    }
    .scene-list {
      display: grid;
      grid-template-columns: auto auto auto;
      gap: 24px;
      .scene-list-item {
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
      }
    }
  }

  .operate {
    height: 72px;
    padding-right: 8px;
    .default-chats {
      display: flex;
      justify-content: end;
      column-gap: 12px;
      padding-top: 16px;
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
    padding-right: 8px;
    .o-input {
      --o-input-border-color: none;
      --o-input-disabled-border-color: rgba(125, 50, 234, 0.4);
      height: 72px;
    }
    .send-icon {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      font-size: 24px;
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
    min-width: 900px;
    padding-left: 64px;
  }
}
.right {
  height: calc(100vh - 112px);
  width: 312px;
  background-color: #fff;
  padding: 24px;
  overflow: auto;
  flex-shrink: 0;
  @include scrollbar;
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
    color: var(--o-color-text1);
    font-size: 16px;
    line-height: 24px;
    padding: 16px 24px;
    background-color: #f4f5f7;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 16px;
    &:hover {
      background-color: #fff;
      box-shadow: 0 8px 40px 0 rgba(18, 20, 23, .1);
    }
  }
}
</style>
