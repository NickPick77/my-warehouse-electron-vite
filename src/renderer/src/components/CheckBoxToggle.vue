<script setup lang="ts">
interface Props {
  isSelected: boolean
}

const { isSelected } = defineProps<Props>()

const emit = defineEmits(['handleCheck'])

const handleClick = () => {
  emit('handleCheck')
}
</script>

<template>
  <div class="check-box" @click="handleClick">
    <div :class="['check-box__toggle', { 'check-box__toggle--selected': isSelected }]">
      <span />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@renderer/assets/style/main.scss' as *;

.check-box {
  &__toggle {
    position: relative;
    display: block;
    width: 40px;
    height: 20px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transform: translate3d(0, 0, 0);

    &::before {
      content: '';
      position: relative;
      top: 3px;
      left: 3px;
      width: 34px;
      height: 14px;
      display: block;
      background: #9a9999;
      border-radius: 8px;
      transition: background 0.2s ease;
    }

    & span {
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      display: block;
      background: white;
      border-radius: 10px;
      box-shadow: 0 3px 8px rgba(154, 153, 153, 0.5);
      transition: all 0.2s ease;

      &::before {
        content: '';
        position: absolute;
        display: block;
        margin: -18px;
        width: 56px;
        height: 56px;
        background: rgba(79, 46, 220, 0.5);
        border-radius: 50%;
        transform: scale(0);
        opacity: 1;
        pointer-events: none;
      }
    }

    &--selected {
      &::before {
        background: #947ada;
      }
    }

    &--selected {
      & span {
        background: #4f2edc;
        transform: translateX(20px);
        transition:
          all 0.2s cubic-bezier(0.8, 0.4, 0.3, 1.25),
          background 0.15s ease;
        box-shadow: 0 3px 8px rgba(79, 46, 220, 0.2);

        &::before {
          transform: scale(1);
          opacity: 0;
          transition: all 0.4s ease;
        }
      }
    }
  }
}
</style>
