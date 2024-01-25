import Quagga from "quagga";

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      Quagga: Quagga,
    },
  };
});
