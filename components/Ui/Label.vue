<script setup lang="ts">

  const props = defineProps({
    text: {
      type: String,
      required: true
    }
  })
  
</script>

<template>
  <label class="block text-sm font-medium text-gray-200">{{ text }}</label>
</template>

