<script setup lang="ts">
  // @ts-ignore
  import useCorporationDetails  from '@/composables/useCorporationDetails';

  const { corporation, currentCorporationId, fetchCorporationData } = useCorporationDetails();

  fetchCorporationData(currentCorporationId.value);
</script>

<template>
  <div v-if="corporation">
    <UiHeaderH1
      :nav-back="`/corporations/${currentCorporationId}`"
      >
      {{ corporation.name }} White Star Logs {{ currentCorporationId }}
    </UiHeaderH1>
    
    <UiParagraph>{{ currentCorporationId }}</UiParagraph>
  </div>
</template>