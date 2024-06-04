<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLangStore } from '@/stores';

import AppHeader from '@/components/AppHeader.vue';

import { refreshInfo } from '@/shared/login';

refreshInfo();
const { locale } = useI18n();
const langStore = useLangStore();
watch(
  () => langStore.lang,
  (val) => {
    locale.value = val;
  }
);
</script>

<template>
  <header><AppHeader></AppHeader></header>
  <main><RouterView></RouterView></main>
</template>

<style lang="scss">
header {
  color:  var(--o-color-brand1);
}
main {
  background-color: #F3F3F3;
  height: 100vh;
}
</style>
