<script setup lang="ts">
  import { useToast } from 'vue-toastification';
  import { CorporationDetails } from '@/types/corporation';

  const config = useRuntimeConfig();
  const toast = useToast();

  const emit = defineEmits(['closePopup', 'successCompanyAdd'])
  const corporationForm = reactive({
    name: '',
    secret: '',
    requiredInfluence: 8888
  });
  const sendRequest = ref(false);


  async function submit() {
    if (sendRequest.value) return;

    if (!corporationForm.name || !corporationForm.secret || corporationForm.name === '' || corporationForm.secret === '') {
      toast.error('Please provide corporation name and secret.')
      return;
    }

    sendRequest.value = true;

    const { data, error, pending } = await useFetch(
      `${config.apiBaseUrl}/corporations/`,
        {
          method: 'POST',
          body: corporationForm,  
        }
      )
      
    if (data.value) {
      toast.success('Corporation added successfully.');
      const newCorp = {...data.value}
      emit('successCompanyAdd', newCorp);
    }
    
    if (error.value) {
      toast.error(`${error.value.response.status} - ${error.value.data.detail}`)
    }
    
    sendRequest.value = pending.value
  }
</script>

<template>
  <div class="w-full sm:w-96 max-w-none sm:max-w-4xl">
    <UiHeaderH2>
      Add Corporation
    </UiHeaderH2>
    <UiDivider />
    <UiInputText
      v-model="corporationForm.name"
      :name="'CorporationName'"
      :value="corporationForm.name"
      :label="'Corporation Name'"
    />
    <UiInputText
      v-model="corporationForm.secret"
      :name="'CorporationSecret'"
      :value="corporationForm.secret"
      :type="'password'"
      :label="'Secret'"
    />
    <UiButton
      :text="'Add Corporation'"
      :layout="'transparent'"
      :size="'sm'"
      @click="submit()"
    />
    <UiButton
      :text="'Cancel'"
      :layout="'transparent'"
      :size="'sm'"
      class="ml-2"
      @click="emit('closePopup')"
    />
  </div>
</template>