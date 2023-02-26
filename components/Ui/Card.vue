<script setup lang="ts">
  const props = defineProps({
    layout: {
      type: String,
      required: false,
      default: ''
    }
  })

  const setCardLayout = () => {
    switch (props.layout) {
      case 'dark': {
        return 'bg-black/30 text-white';
      }
      default: {
        return 'bg-white/10 text-gray-200';
      }
    }
  }
</script>

<template>
  <div
    class="rounded p-2 mb-1"
    :class="setCardLayout()"
  >
    <slot />
  </div>
</template>