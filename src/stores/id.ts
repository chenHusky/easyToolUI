import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

export const useIds = defineStore('id', () => {
  const threadId = ref('');
  return { threadId };
});
export function useIdsStore() {
  const ids = useIds();
  const stores = storeToRefs(ids);
  return stores;
}