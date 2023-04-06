<script setup lang="ts">
  const { corporation, getCorporationSecret } = useCorporationDetails();

  console.log(corporation.value)
</script>

<template>
  <div class="p-2">
    <UiParagraph>
      You can import data from Hades Star Compendium and Discord Bot. 
    </UiParagraph>
  </div>
</template>