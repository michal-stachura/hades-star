<script setup lang="ts">
  const props = defineProps({
    header: {
      type: String,
      required: false,
      default: undefined,
    }
  })
  const emit = defineEmits(['close-popup'])
</script>

<template>
  <div class="w-full h-full fixed bg-black/40 backdrop-blur flex justify-center items-center p-4">
    <div class="bg-slate-800 mx-auto rounded relative">
      <font-awesome-icon
        icon="fa-duotone fa-circle-xmark"
        class="text-gray-200 text-3xl absolute -top-4 -right-4 cursor-pointer transition-all duration-300"
        @click="emit('close-popup')"
      />
      <h2
        v-if="header"
        class="p-2 border-b border-gray-200/10 text-xl font-semibold text-gray-200"
      >
        {{ header }}
    </h2>
    <slot />
    </div>
  </div>
</template>