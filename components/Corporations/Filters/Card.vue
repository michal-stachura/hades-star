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
          :layout="clickedFilter === filter.id ? '' : 'transparent'"
          :class="'mr-2 mb-2'"
          @click="toggleFilter(filter.id)"
        />
    </span>
      <UiButton
        :text="'Manage filters'"
        :size="'sm'"
        @click="navigateTo(`/corporations/${route.params.id}/filters`)"
      />
    </UiCard>
  </div>
</template>
