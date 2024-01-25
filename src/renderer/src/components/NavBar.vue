<script setup lang="ts">
import { ref } from "vue";

const isMenuOpen = ref(false);

const onMenuClickToggle = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <nav class="nav-bar">
    <BurgerIcon
      class="nav-bar__burger-icon"
      :is-menu-open="isMenuOpen"
      @onMenuClickToggle="onMenuClickToggle"
    />
    <MobileMenu :is-menu-open="isMenuOpen" />
  </nav>
</template>

<style lang="scss" scoped>
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
