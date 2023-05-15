<script setup lang="ts">
  


  const { wsLogs, fetchWsLogs } = useWsLogs();
  const { isPopupVisible, popupToggleVisibility } = usePopup();

  const newMatchPopupVisible = ref<boolean>(false)

  fetchWsLogs();

  function toggleAddMatchForm():void {
    newMatchPopupVisible.value = !newMatchPopupVisible.value;
    popupToggleVisibility();
  }

  function hideAllPopups(): void {
    newMatchPopupVisible.value = false;
    popupToggleVisibility();
  }

</script>

<template>
  <div>
    <div class="flex">
      <div class="grow">
        <UiHeaderH1
          :nav-back="`/`"
          class="mb-4"
        >
          White Star Logs
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
          <LazyCorporationsWSLogsAddMatchType />
        </UiPopup>
      </Teleport>
    </ClientOnly>
</template>