<script setup lang="ts">
import corporationsData from '@/data/corporations';

const { corporations } = useCorporations()
corporations.value = corporationsData

</script>

<template>
  <div>
    <UiHeaderH1>Corp list</UiHeaderH1>
    <CorporationsBox 
      v-for="corporation in corporations"
      :key="corporation.id"
      :corporation="corporation"
    />
  </div>
</template>