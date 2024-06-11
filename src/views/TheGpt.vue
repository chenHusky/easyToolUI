<script lang="ts" setup>
import { getAssistant, createThreads, getAllThreads, deleteThreads } from '@/api/api-gpt';
import { initLogin, useStoreData } from '@/shared/login';
import { onMounted, ref } from 'vue';
import LoginModal from './components/LoginModal.vue';
import HistoryList from './components/HistoryList.vue';
import ThreadComponent from './components/ThreadComponent.vue';
import { useIdsStore } from '@/stores/id';

const { guardAuthClient, loginModalVisible } = useStoreData();

const threadCom = ref();
const { threadId, assistantId } = useIdsStore();

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
  initLogin().then(res => {
    if (res) {
      const param = {
        assistant_id: assistantId.value,
        name,
      }
      createThreads(param).then(res => {
        selectThread(res.thread_id);
        initThreads();
      });
    }
  });
}

// 获取所有对话
const threads = ref<any>([]);
const initThreads = (type?: string) => {
  getAllThreads().then((res) => {
    threads.value = res?.filter((item: any) => item.assistant_id) || [];
    // 若为子组件触发则跳过
    if (type === 'child') return;
    // 存在对话选择展示第一条
    if (threads.value.length) {
      selectThread(threads.value[0].thread_id);
    } else {
      selectThread('');
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
onMounted(() => {
  initLogin().then(res => {
    if (res) {
      initIds();
      initThreads();
    }
  });
})
</script>
<template>
  <div class="gpt">
    <div class="left">
      <h3>openGauss 小助手</h3>
      <OButton class="btn" size="small" @click="newThread('新对话')" type="primary">新建对话</OButton>
      <HistoryList @clickItem="selectThread" @deleteItem="deleteThread" :threads="threads"></HistoryList>
    </div>
    <ThreadComponent ref="threadCom" @create-thread="initThreads('child')"></ThreadComponent>
  </div>
  <LoginModal v-model="loginModalVisible"></LoginModal>
</template>

<style scoped lang="scss">
@use '@/shared/styles/mixin/common.scss' as *;
.gpt {
  padding: 32px;
  display: flex;
  column-gap: 72px;
}

.left {
  flex-shrink: 0;
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
    font-weight: 600;
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
