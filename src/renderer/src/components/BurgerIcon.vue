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
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 120;
  height: 4vh;
  margin: 5px 0 0 12px;

  &__slice {
    display: block;
    width: 33px;
    height: 4px;
    margin-bottom: 5px;

    background-color: var(--mw-primary);
    border-radius: 3px;

    transform-origin: 30% 50%;

    transition:
      transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
      background-color 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
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
