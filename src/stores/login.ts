import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLogin = defineStore('login', () => {
  // 登录信息
  const guardAuthClient = ref({
    photo: '',
    username: '',
    identities: [],
  } as any);
  const setGuardAuthClient = (data: any) => {
    if (Object.prototype.toString.call(data) === '[object Object]') {
      Object.keys(guardAuthClient.value).forEach((key) => {
        guardAuthClient.value[key] = data[key];
      });
    } else {
      clearGuardAuthClient();
    }
  };
  const clearGuardAuthClient = () => {
    setGuardAuthClient({});
  };
  const loginModalVisible = ref(false);
  return { guardAuthClient, setGuardAuthClient, clearGuardAuthClient, loginModalVisible };
});
