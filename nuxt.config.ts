// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image-edge',
  ],
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
