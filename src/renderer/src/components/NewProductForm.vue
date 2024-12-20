<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import SquareTextButton from '@components/SquareTextButton.vue'
import { useItemsStore } from '@renderer/store/items'

import type { QuaggaImageObject } from '@renderer/types/quagga'
import { type IpcRendererEvent } from 'electron'

const { openWebCamModal } = window.events
const { barCodeSuccess } = window.ipcRendererListenerAPIs

const itemsStore = useItemsStore()

const itemData = computed(() =>
  itemsStore.getItems.find((item) => item.id === itemsStore.getFormPayload.id)
)

const productName = ref<string>(itemsStore.getFormPayload.item_name)
const barCode = ref<string>(itemsStore.getFormPayload.bar_code ?? itemData.value?.bar_code ?? '')
const quantityNum = ref<number>(Number(itemsStore.getFormPayload.quantity) ?? 0)
const caliber = ref<string>(itemsStore.getFormPayload.caliber ?? '')
const category = ref<string>(itemsStore.getFormPayload.category ?? '')
const serialNumber = ref<string>(itemsStore.getFormPayload.serial_number ?? '')
const purchasePrice = ref<number>(Number(itemsStore.getFormPayload.purchase_price) ?? 0)
const sellingPrice = ref<number>(Number(itemsStore.getFormPayload.selling_price) ?? 0)
const isScanning = ref<boolean>(false)

const emit = defineEmits(['handleClickOnCloseWindow', 'handleClick'])

const handleClick = (type: string) => {
  let formPayload = {}

  if (type === 'save') {
    formPayload = {
      id: itemsStore.getFormPayload.id,
      bar_code: barCode.value,
      item_name: productName.value,
      quantity: quantityNum.value,
      caliber: caliber.value,
      serial_number: serialNumber.value,
      purchase_price: purchasePrice.value,
      selling_price: sellingPrice.value
    }
  }
  emit('handleClick', { type, formPayload })
}

const startScanning = async () => {
  if (!isScanning.value) {
    isScanning.value = true

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
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

onMounted(() => {
  barCodeSuccess((_: IpcRendererEvent, quaggaPayload: QuaggaImageObject) => {
    console.log('codice a barre acquisito', quaggaPayload)

    barCode.value = quaggaPayload.codeResult.code
  })
})
</script>

<template>
  <div class="container">
    <form
      class="container__form"
      @submit.prevent="() => handleClick('save')"
      @keydown.enter="$event.preventDefault()"
    >
      <div class="container__form__input-container">
        <label for="bar-code">Codice a barre</label>
        <div class="container__form__input-container__bar-code">
          <button
            class="container__form__input-container__bar-code__cam-scan-cta"
            @click.prevent="startScanning"
          >
            Apri Webcam
          </button>
          <input
            id="bar-code"
            v-model="barCode"
            type="text"
            name="bar-code"
            placeholder="Scansiona..."
            required
          />
        </div>
      </div>
      <div class="container__form__inputs-wrapper">
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
          <label for="caliber">Calibro</label>
          <input id="caliber" v-model="caliber" type="string" name="caliber" placeholder="9mm..." />
        </div>
        <div class="container__form__input-container">
          <label for="serialNumber">Numero di Serie</label>
          <input
            id="serialNumber"
            v-model="serialNumber"
            type="string"
            name="serialNumber"
            placeholder="0"
          />
        </div>
        <div class="container__form__input-container">
          <label for="sellingPrice">Prezzo di vendita</label>
          <input
            id="sellingPrice"
            v-model="sellingPrice"
            type="number"
            name="sellingPrice"
            placeholder="€0"
          />
        </div>
        <div class="container__form__input-container">
          <label for="purchasePrice">Prezzo d'acquisto</label>
          <input
            id="purchasePrice"
            v-model="purchasePrice"
            type="number"
            name="purchasePrice"
            placeholder="€0"
          />
        </div>
        <div class="container__form__input-container">
          <label for="quantity">Quantità</label>
          <input
            id="quantity"
            v-model="quantityNum"
            type="number"
            name="quantity"
            placeholder="0"
          />
        </div>
        <div class="container__form__input-container">
          <label for="quantity">Categoria</label>
          <select id="quantity" v-model="category" name="quantity">
            <option disabled value="">Please select one</option>
            <option value="weapon">Armi</option>
            <option value="ammo">Munizioni</option>
            <option value="accessories">Accessori</option>
            <option value="clothes">Vestiti</option>
          </select>
        </div>
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
@use '@renderer/assets/style/main.scss' as *;
@use 'sass:color';

$background-color: rgba(22, 126, 222, 0.7);
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  // border-radius: 16px;
  overflow: hidden;

  &__form {
    @include windowContainerBoxShadow;

    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    gap: 30px;
    background-color: white;
    padding: 10%;
    margin: 10%;
    border-radius: 16px;

    &__inputs-wrapper {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
    }

    &__input-container {
      display: grid;
      align-items: center;
      gap: 10px;
      grid-template-rows: repeat(2, auto);

      & input {
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

      &__bar-code {
        display: flex;
        flex-direction: column;
        gap: 10px;

        &__cam-scan-cta {
          @include roundButtonBoxShadow;
          @include robotoFont(1em, light);

          padding: 4% 12%;
          border-radius: 16px;
          border: none;
          background-color: var(--mw-primary);
          color: white;
          transition: background-color 0.5s ease-in-out;
          cursor: pointer;

          &:hover {
            background-color: color.adjust($background-color, $lightness: -10%);
          }
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
