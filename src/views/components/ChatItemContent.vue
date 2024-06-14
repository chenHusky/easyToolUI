<script setup lang="ts">
import { useStoreData } from '@/shared/login';
import { computed, PropType, ref, toRefs } from 'vue';
import Logo from '@/assets/logo.svg';
import IconLike from '~icons/app/icon-like.svg';
import IconUnlike from '~icons/app/icon-unlike.svg';
import IconStomp from '~icons/app/icon-stomp.svg';
import IconUnstomp from '~icons/app/icon-unstomp.svg';
import IconCopy from '~icons/app/icon-copy.svg';
import AiPhoto from '~icons/app/icon-ai-photo.svg';
import { ElMessage } from 'element-plus';
import { useMarkdown } from '@/hooks/useMarkdown';
useMarkdown()

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
const emits = defineEmits(['clickItem']);
const clickItem = (event: any) => {
  if (event.target?.className === 'chat-question-list-item') {
    emits('clickItem', event.target.innerText);
  }
};
const blink = '<span class="blinking">|</span>';
const chat = computed(() => {
  if (chatItem.value.type === 'ai' && chatItem.value.response_metadata?.finish_reason) {
    return useMarkdown().mkit(chatItem.value.content + blink)
  }
  return useMarkdown().mkit(chatItem.value.content)
});
</script>
<template>
  <div v-if="chatItem.type === 'human'" class="chat-item">
    <img :src="guardAuthClient.photo" class="photo" />
    <div class="human-content">
      {{ chatItem.content }}
    </div>
  </div>
  <div v-else class="chat-item">
    <AiPhoto class="photo"></AiPhoto>
    <div class="ai-content">
      <div class="markdown-body" v-dompurify-html="chat" @click="clickItem($event)"></div>
      <div class="icon-group" v-if="chatItem?.response_metadata?.finish_reason === 'stop' || chatItem.type === 'tool'">
        <OIcon v-if="chatItem.type === 'ai'" class="icon" @click="clipTxt(chatItem.content)">
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
    flex-shrink: 0;
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
<style lang="scss">
.chat-question-list {
  display: flex;
  flex-flow: wrap;
  gap: 12px;
  margin-top: 16px;
}
.chat-question-list-item {
  background-color: rgba(125,50,234,.08);
  border-radius: 20px;
  font-size: 16px;
  line-height: 24px;
  padding: 8px 16px;
  color: var(--o-color-text1);
  cursor: pointer;
  &:hover {
    background-image: linear-gradient(270deg, #7d78ff, #7d32ea);
    color: var(--o-color-text2);
  }
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.blinking {
  font-size: var(--o-font-size-h8);
  font-weight: 800;
  animation: blink 1s infinite;
}
</style>
