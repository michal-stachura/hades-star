<script setup lang='ts'>

const props = defineProps({
  navBack: {
    type: String,
    required: false,
  }
})
const redirectBack = (url: string | undefined): void => {
  if (typeof url === 'string') {
    navigateTo(url)
  } else {
    navigateTo('/')
  }
} 


</script>

<template>
  <h1 class="pb-4 text-2xl font-semibold text-gray-200">
    <font-awesome-icon
      v-if="navBack"
      icon="fa-duotone fa-square-arrow-left"
      class="text-3xl mr-2 cursor-pointer"
      @click="redirectBack(navBack)"
    />
    <slot />
  </h1>
</template>