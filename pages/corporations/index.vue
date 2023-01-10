<script setup lang="ts">
  import { Corporation } from '@/types/corporation';
  const config = useRuntimeConfig();

  const { data: corporations, pending, error} = useAsyncData("corporations", async () => {
    const response: Corporation[] = await $fetch(`${config.apiBaseUrl}/corporations/`)

    return response
  })
</script>

<template>
  <div>
    <UiHeaderH1>Corp list</UiHeaderH1>
    <UiCard v-if="error">
      {{ error }}
    </UiCard>
    <CorporationsBox 
      v-if="!pending"
      v-for="corporation in corporations"
      :key="corporation.id"
      :corporation="corporation"
    />
    <UiCard v-else>
      Fetching data please wait...
    </UiCard>
  </div>
</template>