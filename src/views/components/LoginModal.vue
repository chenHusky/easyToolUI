<script setup lang="ts">
import { toRefs } from 'vue';
import { showGuard } from '@/shared/login';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const { modelValue } = toRefs(props);
</script>
<template>
  <el-dialog
    v-model="modelValue"
    :draggable="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :width="450"
    top="40vh"
    :destroy-on-close="true"
  >
    <template #header>
      <h5 class="header">提示</h5>
    </template>
    <div class="main-content">
      页面授权，请先登录
    </div>
    <template #footer>
      <div class="ofooter">
        <OButton size="small" type="primary"  @click="showGuard()">登录</OButton>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.header {
  color: var(--o-color-text1);
  font-size: var(--o-font-size-h5);
  line-height: var(--o-line-height-h5);
  font-weight: 600;
  text-align: center;
}
.ofooter {
  display: flex;
  justify-content: center;
  .o-button {
    border-radius: 20px;
  }
}
.main-content {
  text-align: center;
  padding: 20px 0;
  font-size: 16px;
  color: var(--o-color-text1);
}
</style>
