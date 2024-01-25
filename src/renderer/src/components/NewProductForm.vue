<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RoundCrossButton from './RoundCrossButton.vue'
import SquareTextButton from './SquareTextButton.vue'
import type { QuaggaImageObject } from '../types/quagga'

const { openWebCamModal, barCodeSuccess } = window.events

const productName = ref<string>('')
const barCode = ref<string>('')
const quantity = ref<number>(0)
const isScanning = ref<boolean>(false)

const emit = defineEmits(['handleClickOnCloseWindow', 'handleClick'])

const handleCloseClick = () => {
  emit('handleClickOnCloseWindow')
}

const handleClick = (type: string) => {
  let formPayload = {}

  if (type === 'save') {
    formPayload = {
      bar_code: barCode.value,
      item_name: productName.value,
      quantity: quantity.value
    }
  }
  emit('handleClick', { type, formPayload })

  productName.value = ''
  barCode.value = ''
  quantity.value = 0
}

const startScanning = async () => {
  if (!isScanning.value) {
    isScanning.value = true

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Fotocamera non disponibile')
      isScanning.value = false
      return
    }

    try {
      await openWebCamModal()
    } catch (error) {
      console.log(error)
    }
    isScanning.value = false
  }
}

onMounted(async () => {
  await barCodeSuccess((_, quaggaPayload: QuaggaImageObject) => {
    console.log('codice a barre acquisito', quaggaPayload)

    barCode.value = quaggaPayload.codeResult.code
  })
})
</script>

<template>
  <div class="container">
    <div class="container__header">
      <RoundCrossButton theme="close" @handle-click="handleCloseClick" />
    </div>
    <form
      class="container__form"
      @submit.prevent="() => handleClick('save')"
      @keydown.enter="$event.preventDefault()"
    >
      <div class="container__form__input-container">
        <label for="bar-code">Codice a barre</label>
        <div>
          <button @click.prevent="startScanning">Apri Webcam</button>
        </div>
        <input
          id="bar-code"
          v-model="barCode"
          type="text"
          name="bar-code"
          placeholder="Scansiona..."
          required
        />
      </div>
      <div class="container__form__input-container">
        <label for="item-name">Nome prodotto</label>
        <input
          id="item-name"
          v-model="productName"
          type="text"
          name="item-name"
          placeholder="Il mio prodotto"
          required
        />
      </div>
      <div class="container__form__input-container">
        <label for="quantity">Quantità</label>
        <input id="quantity" v-model="quantity" type="number" name="quantity" placeholder="0" />
      </div>
      <!-- <div class="container__form__input-container">
        <label for="img-url">Immagine prodotto</label>
        <input
          type="text"
          name="img-url"
          id="img-url"
          placeholder="Sfoglia..."
        />
      </div> -->
      <div class="container__form__btn-container">
        <SquareTextButton theme="success" literal="Salva" />
        <SquareTextButton
          theme="error"
          literal="Annulla"
          @click.prevent="() => handleClick('clear')"
        />
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/style/main.scss' as *;

.container {
  @include windowContainerBoxShadow;

  display: flex;
  flex-direction: column;
  align-items: center;
  // border-radius: 16px;
  overflow: hidden;

  &__header {
    @include windowContainerBoxShadow;

    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 6px;
    -webkit-app-region: drag;
    background-color: var(--mw-primary);
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    gap: 6px;

    &__input-container {
      display: grid;
      align-items: center;
      grid-template-rows: repeat(2, 1fr);

      & > input {
        padding: 0.5em 0.8em;
        line-height: 1;
        border: 1px solid rgba(0, 0, 0, 0.01);
        border-radius: 16px;
        box-shadow:
          rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
          rgba(60, 64, 67, 0.15) 0px -1px 2px 0px;

        &:focus {
          outline: 1px dashed rgba(22, 126, 222, 0.7);
          outline-offset: 0.2em;
        }
      }
    }

    &__btn-container {
      display: grid;
      margin-block: 20px;
      gap: 18px;
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
