<script lang="ts" setup>
import { getAssistant, createThreads, getAllThreads, deleteThreads } from '@/api/api-gpt';
import { useStoreData } from '@/shared/login';
import { ref, watch } from 'vue';
import LoginModal from './components/LoginModal.vue';
import HistoryList from './components/HistoryList.vue';
import ThreadComponent from './components/ThreadComponent.vue';
import { useIdsStore } from '@/stores/id';

const { guardAuthClient } = useStoreData();

const visible = ref(false);
const threadCom = ref();
const assistantId = ref('');
const { threadId } = useIdsStore();

// 获取assistantId
const initIds = () => {
  const findGitee = guardAuthClient.value.identities?.find((item: any) => item.provider === 'gitee');
  const param = {
    user_name: guardAuthClient.value.username,
    gitee_name: findGitee ? findGitee.username : '',
  };
  getAssistant(param).then(res => {
    assistantId.value = res.assistant_id;
    document.cookie = `opengpts_user_id=${guardAuthClient.value.username};`;
  })
}

const newThread = (name: string) => {
  const param = {
    assistant_id: assistantId.value,
    name,
  }
  createThreads(param).then(res => {
    selectThread(res.thread_id);
    initThreads();
  });
}

// 获取所有对话
const threads = ref<any>([]);
const initThreads = () => {
  getAllThreads().then((res) => {
    threads.value = res;
    // 存在对话选择展示第一条
    if (threads.value.length) {
      selectThread(threads.value[0].thread_id);
    }
  })
}
// 选中一条对话
const selectThread = (id: string) => {
  threadId.value = id;
  threadCom.value.init();
}
const deleteThread = (id: string) => {
  deleteThreads(id).then(() => {
    initThreads();
  })
}

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
      <h3>openGauss 小助手</h3>
      <OButton class="btn" size="small" @click="newThread('新对话')" type="primary">新建对话</OButton>
      <HistoryList @clickItem="selectThread" @deleteItem="deleteThread" :threads="threads"></HistoryList>
    </div>
    <ThreadComponent ref="threadCom"></ThreadComponent>
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
</style>
