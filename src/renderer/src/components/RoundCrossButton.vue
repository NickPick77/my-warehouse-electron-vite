<script setup lang="ts">
type Themes = 'add' | 'close'

const { theme } = defineProps({
  theme: {
    type: String as () => Themes,
    default: 'add' as Themes
  }
})

const emit = defineEmits(['handleClick'])

const handleClick = () => {
  emit('handleClick')
}
</script>

<template>
  <button v-if="theme === 'close'" class="close-btn" @click.prevent="handleClick">
    <div class="close-btn__line-one" />
    <div class="close-btn__line-two" />
  </button>
  <button v-if="theme === 'add'" class="add-btn" @click.prevent="handleClick">
    <div class="add-btn__line-one" />
    <div class="add-btn__line-two" />
  </button>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;
@use 'sass:color';

$error-color: rgb(255, 0, 0);
$success-color: rgb(25, 184, 57);

.close-btn {
  @include roundButtonBoxShadow;

  position: relative;
  align-self: end;
  height: 12px;
  background-color: $error-color;
  border: none;
  border-radius: 25px;
  margin-right: 10px;
  transition: all 0.2s;
  -webkit-app-region: no-drag;
  transition: background-color 0.5s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: color.adjust($error-color, $lightness: -10%);
  }

  &__line-one,
  &__line-two {
    position: absolute;
    top: 25%;
    left: 47%;
    height: 6px;
    width: 1px;
    border-radius: 2px;
    background-color: color.adjust(rgb(0, 0, 0), $lightness: -20%);
    transition: transform 0.5s ease-in-out;

    &__hover {
      transform: scale(1.01);
    }
  }

  &__line-one {
    transform: rotate(45deg);
  }

  &__line-two {
    transform: rotate(-45deg);
  }
}

.add-btn {
  @include roundButtonBoxShadow;

  position: relative;
  width: 26px;
  height: 26px;
  border-radius: 25px;
  border: none;
  background-color: var(--mw-success);
  -webkit-app-region: no-drag;
  transition: background-color 0.5s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: color.adjust($success-color, $lightness: -10%);
  }

  &__line-one {
    transform: rotate(90deg);
  }

  &__line-one,
  &__line-two {
    position: absolute;
    top: 30%;
    left: 47%;
    height: 12px;
    width: 2px;
    border-radius: 2px;
    background-color: var(--mw-neutral-0);
  }
}
</style>
