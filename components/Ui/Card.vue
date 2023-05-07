<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps({
    layout: {
      type: String,
      required: false,
      default: ''
    },
    footer: {
      type: Boolean,
      required: false,
      default: false
    },
    header: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  const setCardLayout = computed((): string => {
    switch (props.layout) {
      case 'dark': {
        return 'bg-black/30 text-white';
      }
      default: {
        return 'bg-white/10 text-gray-200';
      }
    }
  })

  const setFooterLayout = computed((): string => {
    switch (props.layout) {
      case 'dark': {
        return 'bg-black/70 text-white';
      }
      default: {
        return 'bg-gray-900/90 text-gray-200';
      }
    }
  })
</script>

<template>
  <div
    class="rounded"
    :class="setCardLayout"
  >
    <div
      v-if="header"
      class="p-2 border-b border-gray-200/10"
    >
      <slot name="header" />
    </div>
    <div
      class="p-2"
    >
      <slot />
    </div>
    <div
      v-if="footer"
      class="p-2"
      :class="setFooterLayout"
    >
      <slot name="footer" />
    </div>
  </div>
</template>