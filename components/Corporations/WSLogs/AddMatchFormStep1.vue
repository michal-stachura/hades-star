<script setup lang="ts">
  const emit = defineEmits(['match-type'])
</script>

<template>
  <div class="p-4">
    <UiHeaderH1>Step 1</UiHeaderH1>
    <UiParagraph>Choose White Star match type</UiParagraph>
    <UiButton 
      :text="'5 vs 5'"
      :layout="'transparent'"
      class="mx-2"
      @click="emit('match-type', 5)"
    />
    <UiButton 
      :text="'10 vs 10'"
      :layout="'transparent'"
      class="mx-2"
      @click="emit('match-type', 10)"
    />
    <UiButton 
      :text="'15 vs 15'"
      :layout="'transparent'"
      class="mx-2"
      @click="emit('match-type', 15)"
    />
  </div>
</template>
