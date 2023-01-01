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
    }
  })

</script>

<template>
  <button class="bg-white px-4 py-2 rounded">
    {{ props.text }}
  </button>
</template>