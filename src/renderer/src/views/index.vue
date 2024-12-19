<script setup lang="ts">
import { ref, watch } from 'vue'

import GridContainer from '@components/GridContainer.vue'
import UtilsButtons from '@components/UtilsButtons.vue'


const isItemActive = ref('all')
</script>

<template>
  <main>
    <UtilsButtons />
    <section class="main-content">
      <div class="menu-sidebar">
        <span :class="['menu-sidebar__item', {
          'menu-sidebar__item--active': isItemActive === 'all'
        }]">Tutti i prodotti</span>
        <span class="menu-sidebar__item">Armi</span>
        <span class="menu-sidebar__item">Munizioni</span>
        <span class="menu-sidebar__item">Accessori e vestiti</span>
      </div>

      <GridContainer />
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;
.main-content {
  display: flex;
  padding: 1rem;
  border-radius: 0.5rem;
}

.menu-sidebar {
  display: flex;
  flex-direction: column;
  flex: 0 1 20%;
  gap: 1rem;
  min-height: 70vh;
  padding: 6% 1rem;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  border-right: 1px solid #ccc;
  background-color: white;

  &__item {
    cursor: pointer;
    border-bottom: 1px solid transparent;

    &--active {
      border-bottom: 1px solid #ccc;
      scale: 1.04;
    }

    &:first-child {
      margin-top: 6%;
    }

    &:hover {
      border-bottom: 1px solid #ccc;
      scale: 1.04;
      transition: all 0.3s ease-in-out;
    }
  }
}
</style>
