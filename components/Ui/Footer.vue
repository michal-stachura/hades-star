<script setup lang="ts">
  const footerVisible = ref(false);
  
  setTimeout(() => {
    footerVisible.value = true;
  }, 1000)
</script>

<template>
  <div
    class="bg-black/60 fixed bottom-0 left-0 w-full px-4 text-center max-h-0 overflow-hidden transition-all duration-500"
    :class="{'max-h-[10rem] py-4': footerVisible}"
  >
    <slot />
  </div>
</template>