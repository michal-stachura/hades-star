<script setup lang='ts'>

const props = defineProps({
  navBack: {
    type: String,
    required: false,
  },
  margins: {
    type: String,
    required: false,
    default: 'm-0'
  }
})
const redirectBack = (url: string | undefined): void => {
  if (typeof url === 'string') {
    navigateTo(url)
  } else {
    navigateTo('/')
  }
}

function customClasses() {
  return `text-2xl font-semibold text-gray-200 ${props.margins}`
}
</script>

<template>
  <h1 :class="customClasses()">
    <font-awesome-icon
      v-if="navBack"
      icon="fa-duotone fa-square-arrow-left"
      class="text-3xl mr-2 cursor-pointer"
      @click="redirectBack(navBack)"
    />
    <slot />
  </h1>
</template>