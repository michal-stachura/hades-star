<script setup lang="ts">
  import * as pkg from "vue-toastification";
  const { useToast } = pkg;

  const { corporation, currentCorporationId, getCorporationSecret } = useCorporationDetails();
  const config = useRuntimeConfig();
  const emit = defineEmits(['editCorporation']);
  const sendRequest = ref(false);

  async function syncMembers() {
    if (sendRequest.value) return;

    sendRequest.value = true;
    
    const { data, error, pending } = await useFetch(
      `${config.apiBaseUrl}/corporations/${currentCorporationId.value}/sync-members/`,
      {
        method: `GET`,
        headers: [
          ['Corporation-Secret', getCorporationSecret(currentCorporationId.value)]
        ]
      }
    )
    
    if (data.value) {
      console.log(data.value)
    }
    if (error.value && error.value.response) {
      useToast().error(`${error.value.response.status} - ${error.value.data.error}`)
    }
    sendRequest.value = false;
  }
</script>

<template>
  <div class="p-2">
    <UiParagraph>
      You can import data from Hades Star Compendium and Discord Bot. 
    </UiParagraph>
    <UiInfo v-if="corporation && !corporation.serverId">
      Before you can import data you must provide your corporation server ID. You can find it in your corp Discord.<br />
      <video
        class="mx-auto p-2 border border-gray-600 rounded"
        width="325" height="691" autoplay muted loop>
        <source
        :src="`${config.imagesUrl}/videos/copy-server.id.webm`" type="video/webm"
        >
        Your browser does not support the video tag.
      </video> 
      <div class="text-center">
        <em class="my-2 block">"Right" click on your corporation in Discord and click Copy Server ID at the bottom.</em>
        <UiButton
          :text="'Edit Corporation'"
          class="mx-auto"
          @click="emit('editCorporation')"
        />
      </div>
    </UiInfo>
    <div v-else>
      <div class="text-center">
        <UiParagraph>Please choose one of sychronization</UiParagraph>
        <UiButton
          :text="'Corporation members'"
          class="mr-1"
          @click="syncMembers()"
        />
        <UiButton
          :text="'Tech levels for current members'"
        />

      </div>
    </div>
  </div>
</template>