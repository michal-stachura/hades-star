<template>
  <div class="fixed top-0 w-full shadow-b shadow-2xl p-4 bg-slate-900 text-gray-200">
    <NuxtLink to="/">
      <font-awesome-icon icon="fad fa-house" />
    </NuxtLink>
    <NuxtLink to="/corporations">
      Corporations
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
a {
  @apply p-2 rounded-sm mr-2
}
.router-link-active {
  @apply bg-gray-50/10;
}
</style>