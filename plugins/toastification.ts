// @ts-ignore
import Toast from "vue-toastification/dist/index.mjs";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Toast)
})