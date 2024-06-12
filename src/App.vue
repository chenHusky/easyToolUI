<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import { refreshInfo } from '@/shared/login';

refreshInfo();
</script>

<template>
  <header><AppHeader></AppHeader></header>
  <main><RouterView></RouterView></main>
</template>

<style lang="scss">
header {
  color:  var(--o-color-brand1);
}
#app {
  background-image: url('@/assets/images/bg.png');
}
</style>
