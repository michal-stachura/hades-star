<script setup lang="ts">
  import * as pkg from 'vue-toastification'
  const { useToast } = pkg

  const config = useRuntimeConfig();
  const { currentCorporationId } = useCorporationDetails();

  const sendRequest = ref(false);


  async function setNewMatch(matchType: string): Promise<void> {
    if (sendRequest.value) return;

    const { data, pending, error} = await useFetch(
      `${config.apiBaseUrl}/corporations/${currentCorporationId.value}/add-ws-match/`,
      {
        method: 'POST',
        body: {
          matchType
        },
        headers: [
          ['Corporation-Secret', currentCorporationId.value]
        ]
      }
    );

    if (data.value) {
      useToast().success('New White Star Match added.')
    }
    if (error.value) {
      useToast().error(`${error.value?.response?.status} - ${error.value.data.detail}`)
    }

    sendRequest.value = pending.value;
  }
</script>

<template>
  <div class="p-4">
    <UiHeaderH1>Step 1</UiHeaderH1>
    <UiParagraph>Choose White Star match type</UiParagraph>
    <UiButton 
      :text="'5 vs 5'"
      :layout="'transparent'"
      class="mx-2"
      @click="setNewMatch('5 vs 5')"
    />
    <UiButton 
      :text="'10 vs 10'"
      :layout="'transparent'"
      class="mx-2"
      @click="setNewMatch('10 vs 10')"
    />
    <UiButton 
      :text="'15 vs 15'"
      :layout="'transparent'"
      class="mx-2"
      @click="setNewMatch('15 vs 15')"
    />
  </div>
</template>
