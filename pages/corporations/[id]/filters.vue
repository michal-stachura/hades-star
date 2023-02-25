<script setup lang="ts">
  const route = useRoute()
  const { corporation } = useCorporationDetails();

  console.log(corporation)
</script>

<template>
  <div v-if="corporation">
    <UiHeaderH1
    :nav-back="`/corporations/${route.params.id}`"
    >
      {{ corporation.name }} Filters
    </UiHeaderH1>
  </div>
  <div v-else>
    <ErrorPage />
  </div>
</template>