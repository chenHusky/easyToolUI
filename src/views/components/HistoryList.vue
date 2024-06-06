<script setup lang="ts">
import { formatDate } from '@/shared/utils';
import { PropType, ref, toRefs } from 'vue';
import IconDelete from '~icons/app/icon-delete.svg';
import DeleteThreadModal from './DeleteThreadModal.vue';
import noData from '@/assets/404.png';

const props = defineProps({
  threads: {
    type: Array as PropType<any[]>,
    default: [],
  },
});
const { threads } = toRefs(props);
const deleteVisible = ref(false);
const emits = defineEmits(['clickItem', 'deleteItem']);
const selectThread = (threadId: string) => {
  emits('clickItem', threadId);
};

const deleteIds = ref<string | string[]>('')
const deleteThread = (threadId: string) => {
  deleteIds.value = threadId;
  deleteVisible.value = true;
};
const confirm = () => {
  deleteVisible.value = false;
  emits('deleteItem', deleteIds.value);
}
</script>
<template>
  <div class="threads-history">
    <div class="operate-history">
      <div class="title">历史记录</div>
      <!-- <a class="deleteall">批量删除</a> -->
    </div>
    <template v-if="threads.length">
      <div class="desc">
        仅展示最近200条对话
      </div>
      <div v-for="item in threads" :key="item.thread_id" class="thread" @click="selectThread(item.thread_id)">
        <div class="thread-item">{{ item.name }}</div>
        <OIcon class="thread-delete" @click.stop="deleteThread(item.thread_id)"><IconDelete /></OIcon>
        <p class="thread-time">{{ formatDate(item.updated_at) }}</p>
      </div>
    </template>
    <div v-else class="nodata">
      <img :src="noData">
      暂无记录
    </div>
  </div>
  <DeleteThreadModal v-model="deleteVisible" @submit="confirm" @cancel="deleteVisible = false" :id="deleteIds"></DeleteThreadModal>
</template>
<style lang="scss" scoped>
.operate-history {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  .title {
    font-size: 16px;
    font-weight: 500;
    color: #000;
  }
  .deleteall {
    font-size: 14px;
  }
}
.desc {
  font-size: 12px;
  line-height: 18px;
  color: rgba(0, 0, 0, .6);
  margin-bottom: 16px;
}
.thread {
  width: 100%;
  background-color: #F4F5F7;
  padding: 12px 16px;
  margin-bottom: 8px;
  position: relative;
  cursor: pointer;
  &:hover {
    .thread-delete {
      display: block;
    }
  }
  .thread-item {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--o-color-text1);
    font-size: 14px;
    line-height: 22px;
    font-weight: 600;
    margin-bottom: 4px;
    margin-right: 16px;
  }
  .thread-delete {
    font-size: 16px;
    cursor: pointer;
    position: absolute;
    top: 12px;
    right: 12px;
    display: none;
    &:hover {
      color: var(--o-color-brand1);
    }
  }
  .thread-time {
    font-size: 12px;
    color: rgba(0, 0, 0, .6);
    line-height: 18px;
  }
}
.nodata {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 48px;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, .6);
  row-gap: 8px;
  img {
    width: 200px;
  }
}
</style>
