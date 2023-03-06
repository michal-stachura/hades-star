<script setup lang="ts">
import { faFilterList } from '@fortawesome/pro-duotone-svg-icons';

  const route = useRoute()
  const { corporation } = useCorporationDetails();

  const clickedFilters = ref<string[]>([])

  function toggleFilter(filterId: string): void {
    if (clickedFilters.value.includes(filterId)) {
      clickedFilters.value.splice(clickedFilters.value.indexOf(filterId), 1)
    } else {
      clickedFilters.value.push(filterId)
    }
    filterMembers()
  }

  function attributeGroup(filterId: string): string {
    const weaponIds = ['BATTERY', 'LASER', 'MASS_BATTERY', 'DUAL_LASER', 'BARRAGE', 'DART_LAUNCHER'];
    const shieldIds = ['DELTA_SHIELD', 'PASSIVE_SHIELD', 'OMEGA_SHIELD', 'MIRROR_SHIELD', 'BLAST_SHIELD', 'AREA_SHIELD'];
    const miningIds = ["MINING_BOOST", "HYDROGEN_BAY_EXTENSION", "ENRICH", "REMOTE_MINING", "HYDROGEN_UPLOAD", "MINING_UNITY","CRUNCH", "GENESIS", "HYDROGEN_ROCKET", "MINING_DRONE"];
    const supportIds = ["EMP", "TELEPORT", "RED_STAR_LIFE_EXTENDER", "REMOTE_REPAIR", "TIME_WRAP", "UNITY", "SANCTUARY", "STEALTH", "FORTIFY", "IMPULSE", "ALPHA_ROCKET","SALVAGE", "SUPRESS", "DESTINY", "BARRIER", "VENEGANCE", "DELTA_ROCKET", "LEAP", "BOND", "LASER_TURRET", "ALPHA_DRONE", "SUSPEND", "OMEGA_ROCKET", "REMOTE_BOMB"];
    const tradeIds = ["CARGO_BAY_EXTENSION", "SHIPMENT_COMPUTER", "TRADE_BOOST", "RUSH", "TRADE_BURST", "SHIPMENT_DRONE", "OFFLOAD", "SHIPMENT_BEAM", "ENTRUST", "DISPATCH", "RECALL", "RELIC_DRONE"];
    // console.log(filterId)
    if (weaponIds.includes(filterId)) {
      return 'weapon'
    } else if (shieldIds.includes(filterId)) {
      return 'shield'
    } else if (miningIds.includes(filterId)) {
      return 'mining'
    } else if (supportIds.includes(filterId)) {
      return 'support'
    } else if (tradeIds.includes(filterId)) {
      return 'trade'
    } else {
      return ''
    }

  }

  function filterMembers(): void {
    if (corporation.value) {
      const chosenFilters = corporation.value.filters.filter(filter => clickedFilters.value.includes(filter.id))

      chosenFilters.forEach(filter => {
        filter.conditions.forEach(condition => {
          const attrGroup = attributeGroup(condition.id)
          console.log(attrGroup)

          // TODO: filter members with conditions and add thenm to finall list of members
                    
        })
        console.log(filter)
      })
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
