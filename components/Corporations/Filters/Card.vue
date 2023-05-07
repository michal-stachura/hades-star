<script setup lang="ts">
  import { Condition } from '@/types/filter';

  const route = useRoute()
  const { corporation, filterMembersByTechLevel } = useCorporationDetails();

  const clickedFilter = ref<string>()
  const conditions = ref<Condition[]>([])

  function toggleFilter(filterId: string): void {    
    if (clickedFilter.value === filterId) {
      clickedFilter.value = ''
    } else {
      clickedFilter.value = filterId
    }
    filterMembers()
  }

  function filterMembers(): void {
    if (corporation.value) {
      conditions.value = []
      const chosenFilter = corporation.value.filters.filter(filter => filter.id === clickedFilter.value)
      if (chosenFilter.length > 0) {
        chosenFilter[0].conditions.forEach(condition => {
          conditions.value.push(condition)
        })
        filterMembersByTechLevel(conditions.value)
      } else {
        filterMembersByTechLevel([])
      }
    }
  }
</script>


<template>
  <div>
    <UiCard
      :header="true"
    >
      <template #header>
        <UiHeaderH2>
          <font-awesome-icon icon="fa-duotone fa-filter-list" class="mr-1"/> Filters
        </UiHeaderH2>
      </template>
      <span 
        v-if="corporation"
      >
        <UiButton
          v-for="filter in corporation.filters"
          :id="filter.id"
          :text="filter.name.toString()"
          :size="'sm'"
          :layout="clickedFilter === filter.id ? '' : 'transparent'"
          :class="'mr-2 my-1'"
          @click="toggleFilter(filter.id)"
        />
    </span>
      <UiButton
        :text="'Manage filters'"
        :size="'sm'"
        @click="navigateTo(`/corporations/${route.params.id}/filters`)"
        class="my-1"
      />
    </UiCard>
  </div>
</template>
