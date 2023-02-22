import underscore from 'underscore';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(underscore)
})