<script setup lang="ts">
  import { PropType } from 'vue';
  import { Member } from '@/types/member';
  
  const showNextScanButtons = ref(false)
  const props = defineProps({
  member: {
    required: true,
    type: Object as PropType<Member>
    }
  })
  const nextScan = ref<string | undefined>(props.member.nextWs)
  const { setWsStatus, clearWsStatus } =  useCorporationDetails()

  function changeNextScan(status: string | undefined) {
    nextScan.value = status
    showNextScanButtons.value = false
    if (status !== undefined) {
      setWsStatus(props.member.id, status)
    } else {
      clearWsStatus(props.member.id)
    }
  }
</script>


<template>
  <div class="relative">
    <UiCard
      class="w-10 text-center mx-auto cursor-pointer"
      @click="showNextScanButtons = !showNextScanButtons"
    >
      {{ nextScan || '-' }}
    </UiCard>
    <div class="absolute left-20 top-0 w-48" v-if="showNextScanButtons">
      <UiButton 
        v-if="nextScan !== 'R'"
        :text="'R'" 
        class="mr-2"
        @click="changeNextScan('R')"
      />
      <UiButton
        v-if="nextScan !== 'O'"
        :text="'O'" 
        class="mr-2"
        @click="changeNextScan('O')"
      />
      <UiButton
        v-if="nextScan !== 'X'"
        :text="'X'" 
        class="mr-2"
        @click="changeNextScan('X')"
      />
      <UiButton
        v-if="nextScan"
        :text="'-'" 
        class="mr-2"
        @click="changeNextScan(undefined)"
      />
    </div>
  </div>
</template>