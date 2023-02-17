<script setup lang="ts">
  import * as pkg from "vue-toastification"
  const { useToast } = pkg



  const props = defineProps({
    corporationId: {
      required: true,
      type: String
    },
    setNewSecret: {
      required: false,
      default: false,
    },
    goBackBtn: {
      required: false,
      default: false
    },
    cancelBtn: {
      required: false,
      default: false
    }
  });
  const emit = defineEmits(['corporationSecretChange', 'cancelChangeSecret'])


  const { setCorporationSecret, getCorporationSecret } = useCorporationDetails();
  const sendRequest = ref(false);
  const corporationSecret = ref();
  const config = useRuntimeConfig();
  

  async function checkSecret(secret: String) {
    if (sendRequest.value) {
      return
    }
    sendRequest.value = true;
    
    const { data, error, pending } = await useFetch(
      `${config.apiBaseUrl}/corporations/${props.corporationId}/check-secret/?secret=${secret}`,
    );

    if (error.value) {
      if (error.value.response) {
        useToast().error(`${error.value.response.status} - ${error.value.data.statusText}`)
      }
    } else {
      setCorporationSecret(secret, props.corporationId);
      emit('corporationSecretChange', true)
    }
    sendRequest.value = pending.value
  }

  async function setSecret(secret: String) {
    if (sendRequest.value) {
      return;
    }
    if (!corporationSecret.value || corporationSecret.value === '') {
      useToast().error('Corporation secret cannot be empty.')
      return;
    }
    sendRequest.value = true;
    
    const { data, error, pending } = await useFetch(
      `${config.apiBaseUrl}/corporations/${props.corporationId}/set-secret/`,
      {
        method: 'PATCH',
        body: {
          newSecret: secret
        },
        headers: [
          ['Corporation-Secret', getCorporationSecret(props.corporationId)]
        ],
      }
    );

    if (error.value) {
      if (error.value.response) {
        useToast().error(`${error.value.response.status} - ${error.value.data.statusText}`)
      }
    } else {
      useToast().success('Corporation secret changed. Do not forget to update your tem members.')
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
      v-if="!setNewSecret"
      :text="'Submit'"
      :layout="'transparent'"
      :size="'sm'"
      @click="checkSecret(corporationSecret)"
    />
    <UiButton 
      v-else
      :text="'Set new secret'"
      :layout="'transparent'"
      :size="'sm'"
      @click="setSecret(corporationSecret)"
    />
    <UiButton 
      v-if="goBackBtn"
      :text="'Go back'"
      :layout="'transparent'"
      :size="'sm'"
      class="ml-2"
      @click="navigateTo('/corporations')"
    />
    <UiButton 
      v-if="cancelBtn"
      :text="'Cancel'"
      :layout="'transparent'"
      :size="'sm'"
      class="ml-2"
      @click="emit('cancelChangeSecret')"
    />
  </div>
</template>