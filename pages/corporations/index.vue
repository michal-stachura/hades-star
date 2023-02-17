<script setup lang="ts">
  import { Corporation } from '@/types/corporation';
  const config = useRuntimeConfig();
  const { isPopupVisible, popupToggleVisibility } = usePopup();

  const addCorporationPopup = ref(false);

  const { data: corporations, pending, error} = useAsyncData("corporations", async () => {
    const response: Corporation[] = await $fetch(`${config.apiBaseUrl}/corporations/`)

    return response
  })

  function updateCompanyList(corporation: Corporation) {
    if (corporations.value !== null) {
      corporations.value.push(corporation);
      // sort by name
      corporations.value.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;  // equal names
      })

      hidePopup();
    }
  }
  function hidePopup() {
    addCorporationPopup.value = false;
    popupToggleVisibility()
  }
</script>

<template>
  <div>
    <UiHeaderH1>Corp list</UiHeaderH1>
    <UiCard v-if="error">
      {{ error }}
    </UiCard>
    <div
      v-if="!pending"
      class="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-x-1 lg:grid-cols-3 xl:grid-cols-4"
    >
      <CorporationsBox 
        v-for="corporation in corporations"
        :key="corporation.id"
        :corporation="corporation"
      />
    </div>
    <UiCard v-else>
      Fetching data please wait...
    </UiCard>

    <UiFooter>
      <UiButton 
        :text="'Add Corporation'"
        :layout="'transparent'"
        :size="'sm'"
        class="mr-2"
        @click="addCorporationPopup = true; popupToggleVisibility()"
      />
    </UiFooter>

    <ClientOnly v-if="isPopupVisible && addCorporationPopup">
      <Teleport to="#popup-container">
        <UiPopup
          @close-popup="hidePopup()"
        >
          <div class="p-4">
            <CorporationsAdd
              @close-popup="hidePopup()"
              @success-company-add="updateCompanyList"
            />
          </div>
        </UiPopup>
      </Teleport>
    </ClientOnly>
  </div>
</template>