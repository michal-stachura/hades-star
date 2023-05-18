<script setup lang="ts">
  import { computed } from 'vue';

  const { wsLogs, fetchWsLogs } = useWsLogs();
  const { isPopupVisible, popupToggleVisibility } = usePopup();
  const newMatchPopupVisible = ref<boolean>(false)

  const corpNames = computed(() => (corpName: string, opponentName?: string): string =>{
    const opponent = opponentName ? opponentName : 'Not set yet';
    return `${corpName} vs ${opponent}`;
  })

  function toggleAddMatchForm():void {
    newMatchPopupVisible.value = !newMatchPopupVisible.value;
    popupToggleVisibility();
  }

  function hideAllPopups(): void {
    newMatchPopupVisible.value = false;
    popupToggleVisibility();
  }

  onMounted(() => {
    fetchWsLogs();
  })
</script>

<template>
  <div>
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
      <div class="p-4 grid grid-cols-8 gap-4">
        <div class="col-span-4">
          <UiHeaderH2>Corporations</UiHeaderH2>
        </div>
        <div class="col-span-2">
          <UiHeaderH2>Match type</UiHeaderH2>
        </div>
        <div>
          <UiHeaderH2>Start at</UiHeaderH2>
        </div>
        <div class="text-right">
          <UiHeaderH2>Status</UiHeaderH2>
        </div>
      </div>
      <div
        v-for="match in wsLogs"
        class="p-4 grid grid-cols-8 gap-4 text-white"
      >
        <div class="col-span-4">
          {{  corpNames(match.corporation, match.opponentCorporationName) }}
        </div>
        <div class="col-span-2">
          {{ match.matchType }}
        </div>
        <div>
          {{ match.matchType }}
        </div>
        <div class="text-right">
          {{ match.matchType }}
        </div>
      </div>
      <UiDivider />
      <UiCard>{{ wsLogs }}</UiCard>
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
  </div>
</template>