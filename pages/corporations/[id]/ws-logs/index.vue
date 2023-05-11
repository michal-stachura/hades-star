<script setup lang="ts">
  // @ts-ignore
  import useCorporationDetails  from '@/composables/useCorporationDetails';

  type matchFormReactiveForm = {
    matchType: number,
  }

  const { corporation, currentCorporationId, fetchCorporationData } = useCorporationDetails();
  const { isPopupVisible, popupToggleVisibility } = usePopup();

  const newMatchPopupVisible = ref<boolean>(false)
  const addMatchFormStep = ref<number>(1)
  const wsMatchForm = reactive<matchFormReactiveForm>(
    {
      matchType: 5
    }
  )


  fetchCorporationData(currentCorporationId.value);

  function toggleAddMatchForm():void {
    addMatchFormStep.value = 1; 
    newMatchPopupVisible.value = !newMatchPopupVisible.value;
    popupToggleVisibility();

  }

  function hideAllPopups(): void {
    newMatchPopupVisible.value = false;
    popupToggleVisibility();
  }

</script>

<template>
  <div v-if="corporation">
    <div class="flex">
      <div class="grow">
        <UiHeaderH1
          :nav-back="`/corporations/${currentCorporationId}`"
          class="mb-4"
          >
          {{ corporation.name }} White Star Logs
        </UiHeaderH1>
      </div>
      <div class="grow-0">
        <UiButton 
          :text="'Add match'"
          :icon="['fad', 'plus']"
          :layout="'transparent'"
          :size="'sm'"
          @click="toggleAddMatchForm()"
        />
      </div>
    </div>
    
    <UiHeaderH2>TODO: Add list of already played matches</UiHeaderH2>
  </div>

  <ClientOnly v-if="isPopupVisible && newMatchPopupVisible">
      <Teleport to="#popup-container">
        <UiPopup
          @close-popup="hideAllPopups()"
        >
          <LazyCorporationsWSLogsAddMatchType
            v-if="addMatchFormStep === 1"
          />
          <LazyCorporationsWSLogsAddMatchType
            v-if="addMatchFormStep === 2"
          />
        </UiPopup>
      </Teleport>
    </ClientOnly>
</template>