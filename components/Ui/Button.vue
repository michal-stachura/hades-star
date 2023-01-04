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
    }
  })
  
  const setButtonSize = () => {
    switch (props.size) {
      case 'sm': {
        return 'size-sm'
      }
      default: {
        return 'size-default';
      }
    }
  } 

</script>

<template>
  <button
    :class="setButtonSize()"
    class="bg-white rounded text-slate-800"
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