<script setup lang="ts">
type Themes = 'success' | 'error'

interface Props {
  literal: string
  theme: Themes
}

const { literal } = withDefaults(defineProps<Props>(), {
  literal: '',
  theme: 'success'
})

const emit = defineEmits(['handleClick'])

const handleClick = () => {
  emit('handleClick')
}
</script>

<template>
  <button
    :class="[
      'square-btn',
      {
        'square-btn--success': theme === 'success',
        'square-btn--error': theme === 'error'
      }
    ]"
    @click="handleClick"
  >
    <span>{{ literal }}</span>
  </button>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;

$error-color: rgb(255, 0, 0);
$success-color: rgb(25, 184, 57);

.square-btn {
  @include roundButtonBoxShadow;
  @include robotoFont(1em, light);

  width: 100%;
  padding: 0.3em 1.4em;
  color: var(--mw-neutral-0);
  border-radius: 16px;
  border: none;
  -webkit-app-region: no-drag;
  cursor: pointer;

  &--success {
    background-color: var(--mw-success);

    &:hover {
      background-color: darken($success-color, 10%);
      transition: all 0.5s ease-in-out;
    }
  }

  &--error {
    background-color: var(--mw-error);

    &:hover {
      background-color: darken($error-color, 10%);
    }
  }
}
</style>
