<script setup lang="ts">
  import { CorporationDetails } from '@/types/corporation';
  import * as pkg from "vue-toastification"
  const { useToast } = pkg


  const props = defineProps({
    corporationId: {
      required: true,
      type: String
    }
  });
  const config = useRuntimeConfig();
  

  const { corporation, getCorporationSecret, setCorporationDetails } = useCorporationDetails();
  const emit = defineEmits(['closePopup'])
  const corporationForm = reactive({
    name: corporation.value!.name,
    level: corporation.value!.level,
    flagShip: corporation.value!.flagShip,
    requiredInfluence: corporation.value!.requiredInfluence,
    wsWins: corporation.value!.wsWins,
    discord: corporation.value!.discord
  })
  const sendRequest = ref(false);


  async function submit() {
    if (sendRequest.value) return;

    sendRequest.value = true;

    const { data, error, pending } = await useFetch(
      `${config.apiBaseUrl}/corporations/${props.corporationId}/`,
        {
          method: 'PATCH',
          body: corporationForm,
          headers: [
            ['Corporation-Secret', getCorporationSecret(props.corporationId)]
          ],  
        }
      )
      
    if (data.value) {
      useToast().success('Corporation data updated successfully.');
      setCorporationDetails({...data.value as CorporationDetails});
      emit('closePopup');
    }
    
    if (error.value && error.value.response) {
      useToast().error(`${error.value.response.status} - ${error.value.data.detail}`)
    }
    
    sendRequest.value = pending.value
  }

  function formVerify() {
    if (corporationForm.level > 16) {
      corporationForm.level = 16
    }
    if (corporationForm.level < 0) {
      corporationForm.level = 0
    }
    if (corporationForm.flagShip > 15) {
      corporationForm.flagShip = 15
    }
    if (corporationForm.flagShip < 0) {
      corporationForm.flagShip = 0
    }
    if (corporationForm.requiredInfluence < 0) {
      corporationForm.requiredInfluence = 0
    }
    if (corporationForm.wsWins < 0) {
      corporationForm.wsWins = 0
    }
  }

</script>

<template>
  <div class="text-gray-200 w-full md:w-96">
    <UiHeaderH2>
      Edit Corporation
    </UiHeaderH2>
    <UiDivider />
    <UiInputText
      v-model="corporationForm.name"
      :name="'Name'"
      :value="corporationForm.name"
      :label="'Corporation Name'"
    />
    <div
      class="mt-2 grid grid-cols-2 gap-4"
    >
      <div>
        <UiLabel :text="'Corporation Level'"/>
        <div class="flex">
          <div>
            <UiInputText
            v-model="corporationForm.level"
            :value="corporationForm.level"
            :name="'level'"
            :cssClasses="'w-12 text-center'"
            @change="formVerify()"
            />
          </div>
          <div class="mx-2">
            <font-awesome-icon
              icon="fa-duotone fa-square-minus"
              class="text-4xl mt-0.5 cursor-pointer"
              @click="corporationForm.level--; formVerify()"
            />
          </div>
          <div>
            <font-awesome-icon
              icon="fa-duotone fa-square-plus"
              class="text-4xl mt-0.5 cursor-pointer"
              @click="corporationForm.level++; formVerify()"
            />
          </div>
        </div>
      </div>
      <div>
        <UiLabel :text="'Flagship'"/>
        <div class="flex">
          <div>
            <UiInputText
            v-model="corporationForm.flagShip"
            :value="corporationForm.flagShip"
            :name="'level'"
            :cssClasses="'w-12 text-center'"
            @change="formVerify()"
            />
          </div>
          <div class="mx-2">
            <font-awesome-icon
              icon="fa-duotone fa-square-minus"
              class="text-4xl mt-0.5 cursor-pointer"
              @click="corporationForm.flagShip--; formVerify()"
            />
          </div>
          <div>
            <font-awesome-icon
              icon="fa-duotone fa-square-plus"
              class="text-4xl mt-0.5 cursor-pointer"
              @click="corporationForm.flagShip++; formVerify()"
            />
          </div>
        </div>
      </div>
      <div>
        <UiLabel :text="'Required influence'"/>
        <div class="flex">
          <div>
            <UiInputText
            v-model="corporationForm.requiredInfluence"
            :value="corporationForm.requiredInfluence"
            :name="'level'"
            :cssClasses="'w-13 text-center'"
            @change="formVerify()"
            />
          </div>
          <div class="mx-2">
            <font-awesome-icon
              icon="fa-duotone fa-square-minus"
              class="text-4xl mt-0.5 cursor-pointer"
              @click="corporationForm.requiredInfluence-=500; formVerify()"
            />
          </div>
          <div>
            <font-awesome-icon
              icon="fa-duotone fa-square-plus"
              class="text-4xl mt-0.5 cursor-pointer"
              @click="corporationForm.requiredInfluence+=500; formVerify()"
            />
          </div>
        </div>
      </div>
      <div>
        <UiLabel :text="'WS Wins'"/>
        <div class="flex">
          <div>
            <UiInputText
            v-model="corporationForm.wsWins"
            :value="corporationForm.wsWins"
            :name="'level'"
            :cssClasses="'w-12 text-center'"
            @change="formVerify()"
            />
          </div>
          <div class="mx-2">
            <font-awesome-icon
              icon="fa-duotone fa-square-minus"
              class="text-4xl mt-0.5 cursor-pointer"
              @click="corporationForm.wsWins--; formVerify()"
            />
          </div>
          <div>
            <font-awesome-icon
              icon="fa-duotone fa-square-plus"
              class="text-4xl mt-0.5 cursor-pointer"
              @click="corporationForm.wsWins++; formVerify()"
            />
          </div>
        </div>
      </div>
    </div>
    <UiInputText
      v-model="corporationForm.discord"
      :name="'Discord'"
      :value="corporationForm.discord"
      :label="'Discord'"
    />
    <UiButton
      :text="'Submit'"
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