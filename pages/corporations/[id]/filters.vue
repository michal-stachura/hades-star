<script setup lang="ts">
  const route = useRoute();
  const { corporation } = useCorporationDetails();
  const addFilter = ref(false);

  const filterForm = reactive({
    name: '',
    corporation: corporation.value!.id,
  })

  function saveForm() {
    console.log('Saving form...');
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
        <UiHeaderH2>Add new filter</UiHeaderH2>
        <UiParagraph>Setup criteria for new filter.</UiParagraph>
        <UiDivider />
        <form @submit.prevent="saveForm">
          <UiInputText 
            v-model="filterForm.name"
            :value="filterForm.name"
            :name="'filterName'"
            :label="'Filter name'"
            :css-classes="'w-full lg:w-96'"
          />
        </form>
          List of criteria
        <UiDivider />
        <UiButton 
          :text="'Cancel'"
          :layout="'transparent'"
          :size="'sm'"
          @click="addFilter = false"
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