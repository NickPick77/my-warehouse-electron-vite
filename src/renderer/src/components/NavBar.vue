<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

import BurgerIcon from '@components/BurgerIcon.vue'
import MobileMenu from '@components/MobileMenu.vue'

const isMenuOpen = ref(false)

watch(route, () => {
  onMenuClickToggle()
})

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
@use '@renderer/assets/style/main.scss' as *;
.nav-bar {
  @include windowContainerBoxShadow;

  position: relative;
  display: flex;
  justify-content: flex-start;
  overflow-x: clip;
  z-index: 10;
  background-color: var(--mw-neutral-0);

  &__burger-icon {
    cursor: pointer;

    & > span {
      background-color: var(--mw-primary);
    }
  }
}
</style>
