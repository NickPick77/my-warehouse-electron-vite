<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['handleClick'])

const handleClick = () => {
  emit('handleClick')
}

const isHovered = ref<boolean>(false)
</script>

<template>
  <button
    class="delete-icon"
    @click="handleClick"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <font-awesome-icon
      :class="[isHovered ? 'fa-beat' : '', 'fa-fw', 'fa-xs']"
      icon="fa-solid fa-trash"
    />
  </button>
</template>

<style lang="scss" scoped>
@use '../assets/style/main.scss' as *;

$error-color: rgb(255, 0, 0);

.delete-icon {
  @include roundButtonBoxShadow;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--mw-error);
  width: 26px;
  height: 26px;
  border-radius: 200px;
  border: none;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: darken($error-color, 10%);
    transition: all 0.5s;
  }
}
</style>
