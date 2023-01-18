<script setup lang="ts">
  import { PropType } from 'vue';
  import { useToast } from "vue-toastification";
  import { Member } from '@/types/member';
  
  const showNextScanButtons = ref(false);
  const sendRequest = ref(false);
  const toast = useToast();
  const route = useRoute();
  const config = useRuntimeConfig();

  const props = defineProps({
    member: {
    required: true,
    type: Object as PropType<Member>
    }
  });
  const { setWsStatus, getWsStatus } =  useCorporationDetails()
  const nextScan = ref<string | undefined>(props.member.nextWs);


  async function changeNextScan(status: string | undefined) {
    if (sendRequest.value) {
      return
    }
    sendRequest.value = true;
    showNextScanButtons.value = false;

    const {data, error, pending} = await useFetch<Member>(
      `${config.apiBaseUrl}/members/${props.member.id}/next-ws/`,
      {
        method: 'PATCH',
        body: {
          nextWs: status
        }
      }
    )
    if (data.value) {
      setWsStatus(props.member.id, data.value.nextWs);
      nextScan.value = getWsStatus(props.member.id);
    }
    if (error.value) {
      if (error.value.response) {
        toast.error(`${error.value.response.status} - ${error.value.response.statusText}`)
      }
    }
    sendRequest.value = pending.value
  }


</script>


<template>
  <div class="relative">
    <UiCard
      class="w-10 text-center mx-auto cursor-pointer"
      @click="showNextScanButtons = !showNextScanButtons"
    >
      <span v-if="!sendRequest">
        {{ nextScan || '-' }}
      </span>
      <span v-else>
        ...
      </span>
    </UiCard>
    <div class="absolute left-20 top-0 w-48 z-10" v-if="showNextScanButtons">
      <UiButton 
        v-if="nextScan !== 'R'"
        :text="'R'" 
        class="mr-2"
        @click="changeNextScan('R')"
      />
      <UiButton
        v-if="nextScan !== 'O'"
        :text="'O'" 
        class="mr-2"
        @click="changeNextScan('O')"
      />
      <UiButton
        v-if="nextScan !== 'X'"
        :text="'X'" 
        class="mr-2"
        @click="changeNextScan('X')"
      />
      <UiButton
        v-if="nextScan !== '-'"
        :text="'-'" 
        class="mr-2"
        @click="changeNextScan('-')"
      />
    </div>
  </div>
</template>