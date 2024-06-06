<script lang="ts" setup>
import { getAssistant, createThreads, getAllThreads, deleteThreads, modifyThreads, getThreadState } from '@/api/api-gpt';
import { useStreamState, mergeMessagesById, Message } from '@/hooks/useStreamState';
import { useStoreData } from '@/shared/login';
import { ref, watch } from 'vue';
import LoginModal from './components/LoginModal.vue';
import HistoryList from './components/HistoryList.vue';
import IconSend from '~icons/app/icon-search.svg'
import { useMagicKeys } from '@vueuse/core'

const { enter } = useMagicKeys();
const { guardAuthClient } = useStoreData();

const visible = ref(false);
const userId = ref('');
const assistantId = ref('');
const threadId = ref('');
const searchValue = ref('');

const initIds = () => {
  const findGitee = guardAuthClient.value.identities?.find((item: any) => item.provider === 'gitee');
  const param = {
    user_name: guardAuthClient.value.username,
    gitee_name: findGitee ? findGitee.username : '',
  };
  getAssistant(param).then(res => {
    userId.value = res.name;
    assistantId.value = res.assistant_id;
    document.cookie = `opengpts_user_id=${userId.value};`;
  })
}

const newThread = (name: string) => {
  const param = {
    assistant_id: assistantId.value,
    name,
  }
  createThreads(param).then(res => {
    threadId.value = res.thread_id;
    initThreads();
  });
}
const threads = ref<any>([]);
const initThreads = () => {
  getAllThreads().then((res) => {
    threads.value = res;
  })
}
const allState = ref<Message[]>([])
const getState = (id: string) => {
  getThreadState(id).then(res => {
    allState.value = mergeMessagesById(res.values, []);
  })
}
const selectThread = (id: string) => {
  threadId.value = id;
  getState(id);
}
const deleteThread = (id: string) => {
  deleteThreads(id).then(() => {
    initThreads();
  })
}


const { startStream, stream } = useStreamState();
const sendReq = () => {
  const id = `human-${Math.random()}`
  const input = [{
    content: searchValue.value,
    additional_kwargs: {},
    type: 'human',
    example: false,
    id,
  }];
  startStream(input, threadId.value);
  searchValue.value = '';
}
watch(
  () => stream.value,
  (stream) => {
    if (stream?.status === 'done') {
      getState(threadId.value);
    } else if (stream?.status === 'inflight') {
      allState.value = mergeMessagesById(allState.value, stream.messages)
    }
  }
)
watch(
  () => guardAuthClient.value.username,
  () => {
    if (guardAuthClient.value.username) {
      initIds();
      initThreads();
      visible.value = false;
    } else {
      visible.value = true;
    }
  },
  {
    deep: true,
    immediate: true,
  }
)
watch(enter, (v) => {
  if (v && searchValue.value) {
    sendReq()
  }
})
</script>
<template>
  <div class="gpt">
    <div class="left">
      <h3>Gauss AI小助手</h3>
      <OButton class="btn" size="small" @click="newThread('新对话')" type="primary">新建对话</OButton>
      <HistoryList @clickItem="selectThread" @deleteItem="deleteThread" :threads="threads"></HistoryList>
    </div>
    <div class="right">
      <div class="chat">
        <template v-for="(item, index) in allState">
          <div>{{ item.content }}</div>
        </template>
      </div>
      <div class="send">
        <OInput v-model="searchValue" maxlength="2000" placeholder="请输入你想了解的内容，按Enter发送">
          <template #suffix>
            <div class="send-icon">
              <OIcon @click="sendReq"><IconSend/></OIcon>
            </div>
          </template>
        </OInput>
      </div>
    </div>
  </div>
  <LoginModal v-model="visible"></LoginModal>
</template>

<style scoped lang="scss">
@use '@/shared/styles/mixin/common.scss' as *;
.gpt {
  padding: 32px;
  display: flex;
  column-gap: 40px;
}

.left {
  height: calc(100vh - 112px);
  width: 312px;
  background-color: #fff;
  padding: 24px;
  overflow: auto;
  @include scrollbar;
  h3 {
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 24px;
  }

  .btn {
    width: 100%;
    justify-content: center;
    height: 40px;
    background-image: linear-gradient(270deg, #7d78ff, #7d32ea);
    margin-bottom: 16px;
  }
}

.right {
  width: 70%;

  .chat {
    height: calc(100vh - 184px);
  }

  .send {
    display: flex;
    width: 100%;
    column-gap: 24px;
    .o-input {
      --o-input-border-color: none;
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
    }
  }
}</style>
