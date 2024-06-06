<script setup lang="ts">
import { getThreadState } from '@/api/api-gpt';
import { mergeMessagesById, Message, useStreamState } from '@/hooks/useStreamState';
import { useIdsStore } from '@/stores/id';
import { useMagicKeys } from '@vueuse/core';
import IconSend from '~icons/app/icon-search.svg'
import { nextTick, ref, watch } from 'vue';
import ChatItemContent from './ChatItemContent.vue';

const { threadId } = useIdsStore();
const { enter } = useMagicKeys();
const searchValue = ref('');
const disableInput = ref(false);
const ChatRef = ref();
const { startStream, stream } = useStreamState();

const allState = ref<Message[]>([])
const getState = (id: string) => {
  getThreadState(id).then(res => {
    const arr = mergeMessagesById(res.values, []);
    if (arr.length !== allState.value.length) {
      allState.value = arr;
    }
    if (res.next.length) {
      disableInput.value = true;
    }
    keepScrollBottom();
  })
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

const sendReq = () => {
  if (disableInput.value) return;
  disableInput.value = true;
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

// 回车发送
watch(enter, (v) => {
  if (v && searchValue.value) {
    sendReq()
  }
})

defineExpose({
  init,
});
</script>
<template>
  <div class="right">
    <div class="chat" ref="ChatRef">
      <div v-for="(item) in allState" style="margin-bottom: 24px">
        <ChatItemContent :chat-item="item"></ChatItemContent>
      </div>
    </div>
    <div class="operate"></div>
    <div class="send">
      <OInput :disabled="disableInput" v-model="searchValue" maxlength="2000" placeholder="请输入你想了解的内容，按Enter发送">
        <template #suffix>
          <div class="send-icon" :class="disableInput && 'disableIcon'">
            <OIcon @click="sendReq"><IconSend/></OIcon>
          </div>
        </template>
      </OInput>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '@/shared/styles/mixin/common.scss' as *;
.right {
  width: 70%;

  .chat {
    height: calc(100vh - 256px);
    overflow: auto;
    @include scrollbar;
  }

  .operate {
    height: 72px;
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
}
</style>
