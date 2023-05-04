<script setup lang="ts">
  const { countMembers, hideMembersWithWsStatus } = useCorporationDetails();
  const selectedMembers = ref<string[]>([])

  function isEqual(toCompare:string[]) {
    return selectedMembers.value.length === toCompare.length  && selectedMembers.value.every(item => toCompare.includes(item))
  }

  function updateSelectedMembers(selectedGroups:string[]): void {
    selectedMembers.value = selectedGroups
    hideMembersWithWsStatus(selectedGroups)
  }
</script>

<template>
  <div class="text-gray-200 p-2 rounded bg-white/10">
    <UiHeaderH2>
      <font-awesome-icon icon="fa-duotone fa-bullseye" />
      Next WS scan
    </UiHeaderH2>
    <UiButton 
      :text="`All: ${countMembers([])}`"
      :size="'sm'"
      :layout="selectedMembers.length === 0 ? '' : 'transparent'"
      @click="updateSelectedMembers([])"
      class="mr-2 mb-2"      
    />
    <UiButton 
      :text="`R: ${countMembers(['R'])}`"
      :size="'sm'"
      :layout="isEqual(['R']) ? '' : 'transparent'"
      @click="updateSelectedMembers(['R'])"
      class="mr-2 mb-2"
    />
    <UiButton 
      :text="`R&O: ${countMembers(['R', 'O'])}`"
      :size="'sm'"
      :layout="isEqual(['R', 'O']) ? '' : 'transparent'"
      @click="updateSelectedMembers(['R', 'O'])"
      class="mr-2 mb-2"
    />
    <UiButton 
      :text="`Pending: ${countMembers(['-'])}`"
      :layout="isEqual(['-']) ? '' : 'transparent'"
      :size="'sm'"
      @click="updateSelectedMembers(['-'])"
    />
  </div>
</template>