<script setup lang="ts">
  const { countMembers } = useCorporationDetails();
</script>

<template>
  <div class="text-gray-200 p-2 rounded bg-white/10">
    <UiHeaderH2>
      <font-awesome-icon icon="fa-duotone fa-bullseye" />
      Next WS scan
    </UiHeaderH2>
    <UiButton 
      :text="`All: ${countMembers([])}`"
      :size="'sm'"
      class="mr-1"
      />
      <UiButton 
      :text="`R: ${countMembers(['R'])}`"
      :size="'sm'"
      class="mr-1"
      />
      <UiButton 
      :text="`R&O: ${countMembers(['R', 'O'])}`"
      :size="'sm'"
      class="mr-1"
      />
      <UiButton 
      :text="`Pending: ${countMembers(['-'])}`"
      :size="'sm'"
    />
  </div>
</template>