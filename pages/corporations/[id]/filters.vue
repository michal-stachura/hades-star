<script setup lang="ts">
  import { CorporationDetails } from '@/types/corporation';
  import * as pkg from "vue-toastification"
  const { useToast } = pkg

  const route = useRoute();
  const config = useRuntimeConfig();
  const { corporation, fetchCorporationData, getCorporationSecret, setCorporationDetails } = useCorporationDetails();

  const addFilter = ref(true);
  const isLoading = ref(true);
  const incorrectSecret = ref(false);
  const corporationId: string = typeof(route.params.id) === 'string' ? route.params.id : route.params.id[0]

  // async function fetchCorporationData() {
  //   corporation.value = null;
    
  //   await fetch(
  //     `${config.apiBaseUrl}/corporations/${route.params.id}/`,
  //     {
  //       headers: [['Corporation-Secret', getCorporationSecret(corporationId)]],
  //     }
  //   ).then((response) => {
  //     if (response.ok) {
  //       return response.json()
  //     }
  //     return Promise.reject(response);
  //   }).then((responseJson) => {
  //     setCorporationDetails(responseJson as CorporationDetails)
  //     isLoading.value = false;
  //     incorrectSecret.value = false;
  //   }).catch((error) => {
  //     useToast().error(`${error.status} - ${error.statusText}`)
  //     isLoading.value = false;
  //     incorrectSecret.value = true;
  //   })
  // }


  if (!corporation.value) {
    
    console.log('No corp')
    // fetchCorporationData(corporationId, getCorporationSecret(corporationId));
  }
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