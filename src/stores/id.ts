import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

export const useIds = defineStore('id', () => {
  const threadId = ref('');
  const assistantId = ref('');
  return { threadId, assistantId };
});
export function useIdsStore() {
  const ids = useIds();
  const stores = storeToRefs(ids);
  return stores;
}