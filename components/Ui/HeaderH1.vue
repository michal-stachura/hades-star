<script setup lang='ts'>

const props = defineProps({
  navBack: {
    type: String,
    required: false,
  }
})

</script>

<template>
  <h1 class="pb-4 text-2xl font-semibold text-gray-200">
    <font-awesome-icon
      v-if="props.navBack"
      icon="fa-duotone fa-square-arrow-left"
      class="text-3xl mr-2"
      @click="navigateTo(props.navBack)"
    />
    <slot />
  </h1>
</template>