<script setup lang="ts">
interface Props {
  isMenuOpen: boolean
}

const { isMenuOpen } = defineProps<Props>()

const emit = defineEmits(['onMenuClickToggle'])

const onMenuClickToggle = () => {
  emit('onMenuClickToggle')
}
</script>

<template>
  <div class="burger-icon" @click="onMenuClickToggle">
    <span
      :class="[
        'burger-icon__slice',
        {
          'burger-icon__slice--active': isMenuOpen
        }
      ]"
    />
    <span
      :class="[
        'burger-icon__slice',
        {
          'burger-icon__slice--active': isMenuOpen
        }
      ]"
    />
    <span
      :class="[
        'burger-icon__slice',
        {
          'burger-icon__slice--active': isMenuOpen
        }
      ]"
    />
  </div>
</template>

<style lang="scss" scoped>
.burger-icon {
  position: relative;
  z-index: 12;
  margin: 2% 2% 0 0;
  height: 4vh;

  &__slice {
    display: block;
    width: 33px;
    height: 4px;
    margin-bottom: 5px;

    background: white;
    border-radius: 3px;

    transform-origin: 30% 50%;

    transition:
      transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
      background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
      opacity 0.55s ease;

    &:first-child {
      transform-origin: 0% 0%;
    }

    &--active {
      opacity: 1;
      transform: rotate(-45deg);

      &:nth-last-child(2) {
        transform: rotate(45deg);
      }

      &:nth-last-child(3) {
        opacity: 0;
        transform: scale(0.2, 0.2);
      }
    }
  }
}
</style>
