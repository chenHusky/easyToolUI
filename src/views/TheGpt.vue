<script lang="ts" setup>
import { getAssistant, createThreads, getAllThreads, deleteThreads, getThreadState } from '@/api/api-gpt';
import { useStreamState, mergeMessagesById, Message } from '@/hooks/useStreamState';
import { useStoreData } from '@/shared/login';
import { ref, watch } from 'vue';
import LoginModal from './components/LoginModal.vue';

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
</script>
<template>
  <div class="gpt">
    <div class="left">
      <OButton class="btn" @click="newThread('opengauss')">新建对话</OButton>
      <div v-for="item in threads" :key="item.thread_id" class="thread" @click="selectThread(item.thread_id)">
        {{ item.name }}
        <span @click="deleteThread(item.thread_id)">删除</span>
      </div>
    </div>
    <div class="right">
      <div class="chat">
        <template v-for="(item, index) in allState">
          <div>{{ item.content }}</div>
        </template>
      </div>
      <div class="send">
        <OInput v-model="searchValue"></OInput>
        <OButton @click="sendReq">发送</OButton>
      </div>
    </div>
  </div>
  <LoginModal v-model="visible"></LoginModal>
</template>

<style scoped lang="scss">
.gpt {
  padding: 40px;
  display: flex;
  column-gap: 40px;
}

.left {
  height: 80vh;
  width: 300px;
  background-color: #fff;
  padding: 16px;

  .btn {
    width: 100%;
    justify-content: center;
  }

  .thread {
    width: 100%;
    background-color: #999;
    margin-top: 16px;
    padding: 16px;
  }
}

.right {
  width: 70%;

  .chat {
    height: 65vh;
  }

  .send {
    display: flex;
    background-color: #fff;
    width: 100%;
    column-gap: 24px;
    padding: 16px;
  }
}</style>
