export default defineNuxtPlugin(() => {
  return {
    provide: {
      clipboard: (text: string) => {       
        navigator.clipboard.writeText(text)
      }
    }
  }
})