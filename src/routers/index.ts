import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useLangStore } from '@/stores';

export const routes: RouteRecordRaw[] = [
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/TheGpt.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  // 设置语言
  const langStore = useLangStore();
  const lang = to.fullPath.startsWith('/en/') ? 'en' : 'zh';
  // localStorage.setItem('lang', lang);
  langStore.lang = lang;
});
