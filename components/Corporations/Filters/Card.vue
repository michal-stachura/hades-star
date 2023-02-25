<script setup lang="ts">
  const route = useRoute()
  
</script>


<template>
  <div>
    <UiCard>
      <UiHeaderH2>
        <font-awesome-icon icon="fa-duotone fa-filter-list" class="mr-1"/> Filters
      </UiHeaderH2>
      <NuxtLink 
        :to="`/corporations/${route.params.id}/filters`"
      >
        <UiButton
          :text="'Manage filters'"
          :size="'sm'"
        />
      </NuxtLink>
    </UiCard>
  </div>
</template>