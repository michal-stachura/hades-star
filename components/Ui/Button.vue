<script setup lang="ts">
  import { PropType } from 'vue';
  type ButtonType = 'button' | 'submit'
  
  const props = defineProps({
    type: {
      type: String as PropType<ButtonType>,
      required: false,
      default: 'button',
    },
    text: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: ''
    },
    layout: {
      type: String,
      required: false,
      default: ''
    }
  })
  
  const setButtonSize = () => {
    switch (props.size) {
      case 'sm': {
        return 'size-sm';
      }
      default: {
        return 'size-default';
      }
    }
  }

  const setButtonLayout = () => {
    switch (props.layout) {
      case 'transparent': {
        return 'bg-white/30 rounded text-white hover:bg-white/40';
      }
      default: {
        return 'bg-white rounded text-slate-800';
      }
    }
  }

  const buttonLayout = () => {
    return `${setButtonSize()} ${setButtonLayout()}`
  }
</script>

<template>
  <button
    class="transition-all duration-300 hover:scale-110"
    :class="buttonLayout()"
    :type="props.type"
  >
    {{ props.text }}
  </button>
</template>

<style scoped lang="scss">
  .size-default {
    @apply px-4 py-2;
  }
  .size-sm {
    @apply px-2 py-1 text-sm;
  }
</style>