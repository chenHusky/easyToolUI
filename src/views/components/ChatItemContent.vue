<script setup lang="ts">
import { useStoreData } from '@/shared/login';
import { computed, PropType, ref, toRefs } from 'vue';
import Logo from '@/assets/logo.svg';
import IconLike from '~icons/app/icon-like.svg';
import IconUnlike from '~icons/app/icon-unlike.svg';
import IconStomp from '~icons/app/icon-stomp.svg';
import IconUnstomp from '~icons/app/icon-unstomp.svg';
import IconCopy from '~icons/app/icon-copy.svg';
import { ElMessage } from 'element-plus';

const props = defineProps({
  chatItem: {
    type: Object as PropType<any>,
    default: {},
  },
});
const { chatItem } = toRefs(props);
const { guardAuthClient } = useStoreData();


// 点赞
const like: any = ref(false);
const likeIcon = computed(() => (like.value ? IconUnlike : IconLike));
// 点踩
const stomp: any = ref(false);
const stompIcon = computed(() => (stomp.value ? IconUnstomp : IconStomp));
function clickLike() {
  like.value = !like.value;
  stomp.value = false;
}
function clickStomp() {
  stomp.value = !stomp.value;
  like.value = false;
}
function clipTxt(text: string) {
  navigator.clipboard.writeText(text).then((data) => {
    ElMessage({
      message: '复制成功',
      type: 'success',
    });
  });
}
</script>
<template>
  <div v-if="chatItem.type === 'human'" class="chat-item">
    <img :src="guardAuthClient.photo" class="photo" />
    <div class="human-content">
      {{ chatItem.content }}
    </div>
  </div>
  <div v-else class="chat-item">
    <!-- <img :src="Logo" class="photo" /> -->
    <div class="photo" style="background-color: rgba(125, 50, 234, .5);"></div>
    <div class="ai-content">
      {{ chatItem.content }}
      <div class="icon-group" v-if="chatItem?.response_metadata?.finish_reason === 'stop' || chatItem.type === 'tool'">
        <OIcon class="icon" @click="clipTxt(chatItem.content)">
          <component :is="IconCopy"></component>
        </OIcon>
        <OIcon class="icon" @click="clickLike">
          <component :is="likeIcon"></component>
        </OIcon>
        <OIcon class="icon" @click="clickStomp">
          <component :is="stompIcon"></component>
        </OIcon>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chat-item {
  display: flex;
  column-gap: 16px;
  font-size: 16px;
  line-height: 24px;

  .photo {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
}
.human-content {
  background-image: linear-gradient(90deg, rgba(125, 50, 234, 0.1) 0%, rgba(125,50,234,0.05) 53%, rgba(125,50,234,0.1) 100%);
  border: 1px solid rgba(125, 50, 234, 0.2);
  padding: 11px 32px;
  border-radius: 0 12px 12px 12px;
}
.ai-content {
  background-color: #fff;
  padding: 32px 32px 24px 32px;
  border-radius: 0 12px 12px 12px;
  width: 100%;
}
.icon-group {
  display: flex;
  justify-content: end;
  margin-top: 19px;
  column-gap: 19px;
  .icon {
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
