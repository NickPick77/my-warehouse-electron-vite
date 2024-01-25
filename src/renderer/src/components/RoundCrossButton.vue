<script setup lang="ts">
type Themes = "add" | "close";

interface Props {
  theme: Themes;
}

const { theme } = withDefaults(defineProps<Props>(), {
  theme: "add",
});

const emit = defineEmits(["handleClick"]);

const handleClick = () => {
  emit("handleClick");
};
</script>

<template>
  <button
    v-if="theme === 'close'"
    class="close-btn"
    @click.prevent="handleClick"
  >
    <div class="close-btn__line-one" />
    <div class="close-btn__line-two" />
  </button>
  <button v-if="theme === 'add'" class="add-btn" @click.prevent="handleClick">
    <div class="add-btn__line-one" />
    <div class="add-btn__line-two" />
  </button>
</template>

<style lang="scss" scoped>
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
  cursor: pointer;

  &:hover {
    background-color: darken($error-color, 10%);
  }

  &__line-one,
  &__line-two {
    position: absolute;
    top: 25%;
    left: 47%;
    height: 6px;
    width: 1px;
    border-radius: 2px;
    background-color: darken(rgb(0, 0, 0), 20%);
    transition: all 0.5s;

    &__hover {
      transform: scale(1.01);
      transition: all 0.5s;
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
  cursor: pointer;

  &:hover {
    background-color: darken($success-color, 10%);
    transition: all 0.5s;
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
