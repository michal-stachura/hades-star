<script setup lang="ts">
  import { CorporationDetails } from '@/types/corporation';
  import * as pkg from "vue-toastification"
  const { useToast } = pkg

  const route = useRoute();
  const config = useRuntimeConfig();
  const { corporation, fetchCorporationData, getCorporationSecret, setCorporationDetails } = useCorporationDetails();

  const addFilter = ref(true);
  const corporationId: string = typeof(route.params.id) === 'string' ? route.params.id : route.params.id[0]


  fetchCorporationData(corporationId);

</script>

<template>
  <div v-if="corporation">
    <UiHeaderH1
      :nav-back="`/corporations/${corporationId}`"
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
  <div v-else>
    Fetching data...
  </div>
</template>