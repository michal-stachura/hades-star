<script setup lang="ts">
  // const { isPopupVisible, popupToggleVisibility } = usePopup();

  const emit = defineEmits(['close-popup'])
</script>

<template>
  <div class="w-full h-full bg-black/40 backdrop-blur flex justify-center items-center p-4">
    <div class="bg-slate-800 mx-auto rounded relative">
      <slot />
      <font-awesome-icon
        icon="fa-duotone fa-circle-xmark"
        class="text-gray-200 text-3xl absolute -top-4 -right-4 cursor-pointer transition-all duration-300"
        @click="emit('close-popup')"
      />
    </div>
  </div>
</template>