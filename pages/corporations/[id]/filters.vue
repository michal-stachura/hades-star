<script setup lang="ts">
  const route = useRoute();
  const config = useRuntimeConfig();
  const { corporation, currentCorporationId, fetchCorporationData } = useCorporationDetails();

  const addFilter = ref(false);
  currentCorporationId.value = typeof(route.params.id) === 'string' ? route.params.id : route.params.id[0]


  fetchCorporationData(currentCorporationId.value);

</script>

<template>
  <div v-if="corporation">
    <UiHeaderH1
      :nav-back="`/corporations/${currentCorporationId}`"
      >
      {{ corporation.name }} Filters
    </UiHeaderH1>
    <div
      v-if="!addFilter"
      class="grid lg:grid-cols-4 gap-4"
    >
      <UiCard 
        v-for="filter in corporation.filters"
        :key="filter.id"
        :footer="true"
        :header="true"
      >
        <template #header>
          {{ filter.name }}
        </template>
        {{ filter.conditions }}
        <template #footer>
          <UiButton 
            :text="'Edit'"
            :layout="'transparent'"
            :size="'sm'"
            class="mr-2"
          />
          <UiButton 
            :text="'Delete'"
            :layout="'transparent'"
            :size="'sm'"
            class="mr-2"
          />
        </template>
      </UiCard>
    </div>
    <div v-else>
      <UiCard>
        <CorporationsFiltersForm />
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
</template>