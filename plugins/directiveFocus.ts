export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', {
    mounted (el: HTMLElement) {
      const inputElement = el.querySelector('input') || el
      inputElement.focus()
    },
    getSSRProps (binding: any, vnode: any) {
      // you can provide SSR-specific props here
      return {}
    }
  })
})