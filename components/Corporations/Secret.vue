<script setup lang="ts">
  import { useToast } from "vue-toastification";


  const props = defineProps({
    corporationId: {
      required: true,
      type: String
    }
  });
  const emit = defineEmits(['corporationSecretChange'])


  const { setCorporationSecret } = useCorporationDetails();
  const sendRequest = ref(false);
  const corporationSecret = ref();
  const config = useRuntimeConfig();
  const toast = useToast();

  async function setSecret(secret: String) {
    if (sendRequest.value) {
      return
    }
    sendRequest.value = true;
    
    const { data, error, pending } = await useFetch(
      `${config.apiBaseUrl}/corporations/${props.corporationId}/check-secret/?secret=${secret}`,
    );

    if (error.value) {
      if (error.value.response) {
        toast.error(`${error.value.response.status} - ${error.value.data.statusText}`)
      }
    } else {
      setCorporationSecret(secret, props.corporationId);
      emit('corporationSecretChange', true)
    }
    sendRequest.value = pending.value
  }
</script>

<template>
  <div>
    <UiParagraph>
      Please provide your company's secret password below.
    </UiParagraph>
    <UiDivider />
    <UiInputText
      v-model="corporationSecret"
      :name="'Secret'"
      :value="corporationSecret"
      :type="'password'"
      :label="'Secret password'"
    />
    <UiButton 
      :text="'Submit'"
      @click="setSecret(corporationSecret)"
    />
    <UiButton 
      :text="'Go back'"
      class="ml-2"
      @click="navigateTo('/corporations')"
    />
  </div>
</template>