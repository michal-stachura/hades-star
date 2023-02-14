<script setup lang="ts">
const { isPopupVisible } = usePopup();
</script>

<template>
  <div>
    <NavBar />
    <div class="mt-14 bg-[url('/images/bck.jpg')] bg-center bg-cover min-h-screen">
      <div class="container mx-auto p-4">
        <NuxtPage />
      </div>
    </div>
    <div v-if="isPopupVisible" id="popup-container"></div>
  </div>
</template>

<style lang="scss">
  .page-enter-active,
  .page-leave-active {
    transition: all 0.4s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    filter: blur(1rem);
  }

  #popup-container {
    @apply absolute top-0 left-0 w-full h-screen;
  }
</style>