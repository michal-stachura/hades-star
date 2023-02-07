<script setup lang="ts">

  const props = defineProps({
    text: {
      type: String,
      required: true,
    }
  })
</script>

<template>
  <span class="bg-white/10 rounded-full py-1 px-3 text-gray-200 text-xs mr-2">
    {{ text }}
  </span>
</template>