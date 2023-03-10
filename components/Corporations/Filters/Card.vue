<script setup lang="ts">
  import { Condition } from '@/types/filter';

  const route = useRoute()
  const { corporation, filterMembersByTechLevel } = useCorporationDetails();

  const clickedFilters = ref<string[]>([])
  const conditions = ref<Condition[]>([])

  function toggleFilter(filterId: string): void {
    if (clickedFilters.value.includes(filterId)) {
      clickedFilters.value.splice(clickedFilters.value.indexOf(filterId), 1)
    } else {
      clickedFilters.value.push(filterId)
    }
    filterMembers()
  }

  function filterMembers(): void {
    if (corporation.value) {
      conditions.value = []
      const chosenFilters = corporation.value.filters.filter(filter => clickedFilters.value.includes(filter.id))

      chosenFilters.forEach(filter => {
        filter.conditions.forEach(condition => {
          conditions.value.push(condition)
        })
      })

      filterMembersByTechLevel(conditions.value)

      // console.log(conditions.value)
      // chosenFilters.forEach(filter => {
      //   conditions.value.push(filter)
      //   filter.conditions.forEach(condition => {
      //     const attrGroup = attributeGroup(condition.id)
      //     console.log(attrGroup)
      //     // TODO: filter members with conditions and add thenm to finall list of members

      //   })

      //   console.log(filter)
      // })
      // console.log(chosenFilters)
      // console.log(corporation.value.members)
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
          :layout="clickedFilters.includes(filter.id) ? '' : 'transparent'"
          :class="'mr-2'"
          @click="toggleFilter(filter.id)"
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
