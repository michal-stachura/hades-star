<template>
  <div>
    <NavBar />
    <div class="mt-14 bg-[url('/assets/images/bck.jpg')] bg-center bg-cover min-h-screen">
      <div class="container p-4">
        <NuxtPage />
      </div>
    </div>
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
</style>