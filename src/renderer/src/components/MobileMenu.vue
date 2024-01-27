<script setup lang="ts">
interface Props {
  isMenuOpen: boolean
}

const { isMenuOpen } = defineProps<Props>()
</script>

<template>
  <ul
    :class="[
      'mobile-menu',
      {
        'mobile-menu--active': isMenuOpen
      }
    ]"
  >
    <router-link class="mobile-menu__item" to="/">
      <li>Prodotti</li>
    </router-link>
    <!-- <router-link class="mobile-menu__item" to="/">
      <li>Su di noi</li>
    </router-link> -->
    <router-link class="mobile-menu__item" to="/settings">
      <li>Impostazioni</li>
    </router-link>
  </ul>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;

.mobile-menu {
  @include windowContainerBoxShadow;

  position: absolute;
  z-index: 11;
  display: flex;
  width: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 2%;
  margin: 0;
  background-color: rgba(22, 126, 222, 1);
  border: 1px solid rgba(0, 0, 0, 0.01);
  border-bottom-left-radius: 16px;
  transform-origin: 0% 0%;
  transform: translateX(100%);
  transition:
    transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
    background-color 0.4s cubic-bezier(0.8, 0.4, 0.3, 1.25);

  &--active {
    transform: none;
  }

  &__item {
    padding: 2%;
    width: 100%;
    text-align: center;
    color: white;
    text-decoration: none;
    transition: background-color 0.4s ease-out;

    &:hover {
      background-color: rgb(22, 119, 222);
    }

    & li {
      list-style: none;
    }
  }
}
</style>
