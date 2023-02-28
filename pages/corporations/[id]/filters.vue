<script setup lang="ts">
  const route = useRoute();
  const { corporation } = useCorporationDetails();
  const addFilter = ref(true);
  const filterName = ref();
  const config = useRuntimeConfig();
</script>

<template>
  <div v-if="corporation">
    <UiHeaderH1
      :nav-back="`/corporations/${route.params.id}`"
      >
      {{ corporation.name }} Filters
    </UiHeaderH1>
    <div v-if="!addFilter">
      <UiCard 
        v-for="filter in corporation.filters"
        :key="filter.id"
      >
        {{ filter.name }}
        <UiDivider />
        {{ filter.conditions }}
      </UiCard>
    </div>
    <div v-else>
      <UiCard>
        <CorporationsFiltersForm 
          :corporation-id="corporation.id"
          @close-popup="addFilter = false"
        />
      </UiCard>
    </div>
    

    <UiFooter>
      <UiButton 
        :text="'Create new filter'"
        :layout="'transparent'"
        :size="'sm'"
        class="mr-2"
        @click="addFilter = true"
      />
    </UiFooter>
  </div>
  <div v-else>
    <ErrorPage />
  </div>
</template>