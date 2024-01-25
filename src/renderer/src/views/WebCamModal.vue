<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { QuaggaImageObject } from "../types/quagga";
import { useQuaggaScanRectangle } from "../composables/quaggaScanRectangle";

export interface ProductFormPayload {
  type: "save" | "clear";
  formPayload: {
    bar_code: string;
    item_name: string;
    quantity: number;
  };
}

const nuxtApp = useNuxtApp();

const { barCodeDetected } = window.events;

const barcodeScanner = ref<(Element & HTMLDivElement) | null>(null);

const handleBarcodeDetection = async (result: QuaggaImageObject) => {
  console.log("Codice a barre rilevato:", result);

  await barCodeDetected(result);

  nuxtApp.$Quagga.stop();
};

useQuaggaScanRectangle();

onMounted(() => {
  nuxtApp.$Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: barcodeScanner.value,
        locate: true,
        singleChannel: false,
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        constraints: {
          width: 600,
          height: 400,
          facingMode: "environment", // 'user' per la fotocamera frontale
        },
        drawBoundingBox: true, // Disegna il riquadro attorno al codice a barre rilevato
        drawScanline: true, // Disegna la linea di scansione
        showPattern: true, //
      },
      decoder: {
        readers: {
          format: "ean_reader",
          config: {
            supplements: ["ean_5_reader", "ean_2_reader"],
          },
        },
      },
    },
    (err: unknown) => {
      if (err) {
        console.error("Errore durante l'inizializzazione di Quagga:", err);
        return;
      }
      nuxtApp.$Quagga.start();
    }
  );

  nuxtApp.$Quagga.onDetected(handleBarcodeDetection);
});

onBeforeUnmount(() => {
  nuxtApp.$Quagga.stop();
});
</script>

<template>
  <section>
    <div ref="barcodeScanner"></div>
  </section>
</template>

<style lang="scss" scoped>
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
