<script setup lang="ts">
  import { computed } from 'vue';
  const route = useRoute();
  const config = useRuntimeConfig();
  const { corporation, currentCorporationId, fetchCorporationData } = useCorporationDetails();

  const addFilter = ref(false);
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