<script setup lang="ts">

  const props = defineProps({
    text: {
      type: String,
      required: true,
    }
  })
</script>

<template>
  <span class="bg-white/10 rounded-full py-1 px-3 text-gray-200 text-xs mr-1 mb-1 inline-block">
    {{ text }}
  </span>
</template>