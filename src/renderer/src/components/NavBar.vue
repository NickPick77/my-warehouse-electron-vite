<script setup lang="ts">
import { ref } from 'vue'

import BurgerIcon from './BurgerIcon.vue'
import MobileMenu from './MobileMenu.vue'

const isMenuOpen = ref(false)

const onMenuClickToggle = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="nav-bar">
    <BurgerIcon
      class="nav-bar__burger-icon"
      :is-menu-open="isMenuOpen"
      @on-menu-click-toggle="onMenuClickToggle"
    />
    <MobileMenu :is-menu-open="isMenuOpen" />
  </nav>
</template>

<style lang="scss" scoped>
@use '../assets/style/main.scss' as *;
.nav-bar {
  @include windowContainerBoxShadow;

  position: relative;
  display: flex;
  justify-content: flex-end;
  overflow-x: clip;
  z-index: 10;
  color: var(--mw-neutral-0);
  background-color: var(--mw-primary);

  &__burger-icon {
    cursor: pointer;
  }
}
</style>
