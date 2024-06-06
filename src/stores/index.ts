import { defineStore } from 'pinia';

// 语言
export const useLangStore = defineStore('lang', {
  state: () => {
    return {
      lang: 'zh',
    };
  },
  actions: {
    setLangStore(val: string) {
      this.lang = val;
    },
  },
});
