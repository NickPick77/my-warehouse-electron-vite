<script setup lang="ts">
type Themes = 'main' | 'error'

interface Props {
  theme?: Themes
}

const { theme } = withDefaults(defineProps<Props>(), {
  theme: 'main'
})

const emit = defineEmits(['handleClick'])

const handleClick = () => {
  emit('handleClick')
}
</script>

<template>
  <button :class="['delete-icon', `delete-icon--${theme}`]" @click="handleClick">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;

$error-color: rgb(255, 0, 0);
$background-color: rgba(22, 126, 222, 0.7);

.delete-icon {
  @include roundButtonBoxShadow;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  border-radius: 200px;
  border: none;
  color: white;
  cursor: pointer;

  &--main {
    background-color: var(--mw-primary);

    &:hover {
      background-color: darken($background-color, 10%);
      transition: background-color 0.5s ease-in-out;
    }
  }

  &--error {
    background-color: var(--mw-error);

    &:hover {
      background-color: darken($error-color, 10%);
      transition: background-color 0.5s ease-in-out;
    }
  }
}
</style>
