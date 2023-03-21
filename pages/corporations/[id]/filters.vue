<script setup lang="ts">
  import { computed } from 'vue';
  import { Filter } from '@/types/filter';
  import * as pkg from "vue-toastification"
  const { useToast } = pkg
  const route = useRoute();
  const config = useRuntimeConfig();
  const { corporation, currentCorporationId, fetchCorporationData, getCorporationSecret, deleteCorporationFilter } = useCorporationDetails();

  const addFilter = ref(false);
  const filterToDelete = ref<Filter>();
  const sendRequest = ref<boolean>(false);
  currentCorporationId.value = typeof(route.params.id) === 'string' ? route.params.id : route.params.id[0]


  fetchCorporationData(currentCorporationId.value);

  const conditionName = computed(() => {
    return (type: string): string => {
      switch (type) {
        case 'lower': {
          return 'lower or equal than'
        }
        case 'bigger': {
          return 'greater or equal than'
        }
        default: {
          return 'equal to'
        }
      }
    }
  })

  async function deleteFilter(): Promise<void> {
    if (sendRequest.value) return;
    sendRequest.value = true;

    if (filterToDelete.value) {
      const { pending } = await useFetch(
        `${config.apiBaseUrl}/corporations/${currentCorporationId.value}/delete-filter/`,
        {
          method: 'DELETE',
          body: {
            filterId: filterToDelete.value.id
          },
          headers: [
            ['Corporation-Secret', getCorporationSecret(currentCorporationId.value)]
          ],

          onResponse({ request, response, options }) {
            if (response.status === 204 ) {
              useToast().success('Filter deleted');
              if (filterToDelete.value && filterToDelete.value.id) {
                deleteCorporationFilter(filterToDelete.value.id);
                filterToDelete.value = undefined;
              }
            } else {
              useToast().error(`${response.status} - Error. Please try again later.`)
            }
          }
        }
      )
      sendRequest.value = pending.value
    }
    
  }
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
      class="grid lg:grid-cols-4 gap-1"
    >
      <div
        v-for="filter in corporation.filters"
      >
        <UiCard
          :key="filter.id"
          :footer="true"
          :header="true"
        >
          <template #header>
            {{ filter.name }}
          </template>
          <div
            v-for="condition in filter.conditions"
            class="flex items-center py-2"
          >
            <div
              class="pr-2"
            >
              <nuxt-img
                :src="`${config.imagesUrl}/images/${$slugify(condition.name)}.png`"
                :class="'w-8'"
                loading="lazy"
                v-tooltip="{content: condition.name}"
              />
            </div>
            <div class="grow">{{ conditionName(condition.type) }}</div>
            <div class="p-1 font-bold">{{ condition.set }}</div>
          </div>
          <template #footer>
            <span
              v-if="filterToDelete !== filter"
            >
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
                @click="filterToDelete = filter"
              />
            </span>
            <span
              v-else-if="filterToDelete === filter"
            >
              <UiInfo>
                This action is permanent. Are you sure?
              </UiInfo>
              <UiButton
                :text="'No'"
                :layout="'transparent'"
                :size="'sm'"
                class="mr-2"
                @click="filterToDelete = undefined"
              />
              <UiButton
                :text="'Yes I\'m sure'"
                :layout="'transparent'"
                :size="'sm'"
                @click="deleteFilter()"
              />
            </span>
          </template>
        </UiCard>
      </div>
    </div>
    <div v-else>
      <UiCard>
        <CorporationsFiltersForm
          @cancel-form="addFilter = false"
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
</template>