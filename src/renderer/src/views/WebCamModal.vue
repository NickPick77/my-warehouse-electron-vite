<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject } from 'vue'
import type { QuaggaImageObject } from '@renderer/types/quagga'
import { useQuaggaScanRectangle } from '@renderer/composables/quaggaScanRectangle'

export interface ProductFormPayload {
  type: 'save' | 'clear'
  formPayload: {
    bar_code: string
    item_name: string
    quantity: number
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $Quagga: any = inject('Quagga')

const { barCodeDetected } = window.events

const barcodeScanner = ref<(Element & HTMLDivElement) | null>(null)
let detectionHash = {}

const handleBarcodeDetection = async (result: QuaggaImageObject) => {
  detectionHash[result.codeResult.code]
  if (!isNaN(detectionHash[result.codeResult.code])) {
    detectionHash[result.codeResult.code]++
  } else {
    detectionHash[result.codeResult.code] = 0
  }

  if (detectionHash[result.codeResult.code] > 5) {
    detectionHash = {}

    await barCodeDetected(result)

    $Quagga.stop()
  }
}

useQuaggaScanRectangle()

onMounted(() => {
  console.log(barcodeScanner.value)
  $Quagga.init(
    {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: barcodeScanner.value,
        singleChannel: false
      },
      locate: true,
      locator: {
        patchSize: 'medium',
        halfSample: true
      },
      constraints: {
        width: 1920,
        height: 1080,
        facingMode: 'environment', // 'user' per la fotocamera frontale
        aspectRatio: { min: 1, max: 2 }
      },
      debug: {
        drawBoundingBox: true,
        showFrequency: true,
        drawScanline: true,
        showPattern: true
      },
      numOfWorkers: 4,
      frequency: 20,
      decoder: {
        readers: [
          {
            format: 'ean_reader',
            config: {
              // supplements: ['ean_5_reader', 'ean_2_reader', 'ean_8_reader']
            }
          }
        ]
      }
    },
    (err: unknown) => {
      if (err) {
        console.error("Errore durante l'inizializzazione di Quagga:", err)
        return
      }
      console.log('inizializzazione di Quagga', $Quagga.CameraAccess.getActiveTrack().getSettings())

      $Quagga.start()
    }
  )

  console.log('ci arrivo qu')

  $Quagga.onDetected(handleBarcodeDetection)
})

onBeforeUnmount(() => {
  $Quagga.stop()
})
</script>

<template>
  <section>
    <div ref="barcodeScanner" />
  </section>
</template>

<style lang="scss" scoped>
@use '../assets/style/main.scss' as *;

section {
  & > div {
    height: 100vh;
  }
}

.drawingBuffer {
  position: absolute;
}
</style>

<style lang="scss">
.drawingBuffer {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
