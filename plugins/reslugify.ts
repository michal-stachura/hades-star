export default defineNuxtPlugin(() => {
  return {
    provide: {
      reslugify: (text: string) => {       
        return `${text.charAt(0).toLocaleUpperCase()}${
          text
            .slice(1)
            .toLocaleLowerCase()
            .trim()
            .replace(/[\s_-]+/g, ' ')
          }`
      }
    }
  }
})