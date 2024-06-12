<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { useLangStore } from '@/stores';

import OIcon from 'opendesign/icon/OIcon.vue';

import { useI18n } from 'vue-i18n';
import { showGuard, logout, useStoreData } from '@/shared/login';
import Logo from '@/assets/logo.svg';
import IconLogin from '~icons/app/icon-login.svg';
import { useRouter } from 'vue-router';

const { t, locale } = useI18n({ useScope: 'global' });

const lang = computed(() => {
  return useLangStore().lang;
});

const { guardAuthClient } = useStoreData();

// 选择语言;
const options = ref([
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
]);
// 选择语言
const handleCommand = (command: any): void => {
  locale.value = command.value;

  const { pathname } = window.location;
  const newHref = pathname.split('/');
  newHref[1] = command.value;
  useLangStore().setLangStore(command.value);
  window.location.href = newHref.join('/');
};

watch(
  () => {
    return locale.value as string;
  },
  (val) => {
    useLangStore().setLangStore(val);
  }
);

const jumpToUserZone = () => {
  const language = lang.value === 'zh' ? 'zh' : 'en';
  const origin = import.meta.env.VITE_LOGIN_ORIGIN;
  window.open(`${origin}/${language}/profile`, '_black');
};
const router = useRouter();
const jumpToHome = () => {
  const language = lang.value === 'zh' ? 'zh' : 'en';
  router.push(`/${language}/package`);
};
const jumpToApply = () => {
  const language = lang.value === 'zh' ? 'zh' : 'en';
  router.push(`/${language}/apply-package`);
};
</script>

<template>
  <div class="app-header">
      <img :src="Logo" class="logo">
      <div class="opt-user">
        <div v-if="guardAuthClient?.username">
          <div class="opt-info">
            <img
              v-if="guardAuthClient.photo"
              :src="guardAuthClient.photo"
              class="opt-img"
            />
            <div v-else class="opt-img"></div>
            <p class="opt-name" :title="guardAuthClient?.username">
              {{ guardAuthClient.username }}
            </p>
          </div>
          <ul class="menu-list">
            <li @click="jumpToUserZone()">{{ t('common.USER_CENTER') }}</li>
            <li @click="logout()">{{ t('common.LOGOUT') }}</li>
          </ul>
        </div>
        <div v-else class="login" @click="showGuard()">
          <OIcon class="icon">
            <IconLogin />
          </OIcon>
        </div>
      </div>
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  height: 48px;
  padding-left: 32px;
  padding-right: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--o-color-bg2);
  box-shadow: 0 1px 16px 0 rgba(25, 25, 25, .05);
  .logo {
    width: 96px;
  }
}
.opt-user {
  margin-right: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  .opt-info {
    display: flex;
    align-items: center;
    .opt-img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      vertical-align: middle;
      @media (max-width: 1100px) {
        width: 28px;
        height: 28px;
      }
    }
    .opt-name {
      color: var(--o-color-text1);
      margin-left: 8px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 72px;
      line-height: var(--o-line-height-h8);
      @media (max-width: 1100px) {
        display: none;
      }
    }
  }
  &:hover {
    .menu-list {
      display: block;
    }
  }
  .menu-list {
    display: none;
    position: absolute;
    top: 48px;
    left: 0;
    @media (max-width: 1100px) {
      top: 48px;
      left: -60px;
    }
    background: var(--o-color-bg2);
    cursor: pointer;
    z-index: 999;
    box-shadow: var(--o-shadow-l1);
    min-width: 78px;
    li {
      line-height: var(--o-line-height-h3);
      text-align: center;
      font-size: var(--o-font-size-text);
      color: var(--o-color-text1);
      border-bottom: 1px solid var(--o-color-division1);
      padding: 0 var(--o-spacing-h5);
      white-space: nowrap;
      &:last-child {
        border-bottom: 0 none;
      }

      &:hover {
        background: var(--o-color-brand1);
        color: var(--o-color-text2);
      }
      &.active {
        color: var(--o-color-brand1);
        background: none;
        cursor: default;
      }
    }
  }
}
.icon {
  font-size: 24px;
}
</style>
