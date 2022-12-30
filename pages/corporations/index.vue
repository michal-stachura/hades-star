<script setup lang="ts">
import corporationsData from '~/data/corporations.json';
import { Corporation } from '~/types/corporation';

const corporations = ref<Corporation[]>(corporationsData)

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