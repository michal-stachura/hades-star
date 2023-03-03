<script setup lang="ts">
  const route = useRoute()
  const { corporation } = useCorporationDetails();
</script>


<template>
  <div>
    <UiCard>
      <UiHeaderH2>
        <font-awesome-icon icon="fa-duotone fa-filter-list" class="mr-1"/> Filters
      </UiHeaderH2>
      <span 
        v-if="corporation"
      >
        <UiButton
          v-for="filter in corporation.filters"
          :id="filter.id"
          :text="filter.name.toString()"
          :size="'sm'"
          :layout="'transparent'"
          :class="'mr-2'"
        />
    </span>
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