<script setup lang="ts">
  import * as pkg from "vue-toastification";
  import { HSCMember } from "@/types/hscmember";
  interface HSCSyncResponse {
    meta?: Object;
    data?: HSCMember[];
  }
  const { useToast } = pkg;

  const { corporation, currentCorporationId, getCorporationSecret, setCorporationDetails } = useCorporationDetails();
  const config = useRuntimeConfig();
  const emit = defineEmits(['editCorporation', 'closePopup']);
  const sendRequest = ref<boolean>(false);
  const syncedMembers = ref<HSCSyncResponse | null>(null);
  const filteredMembers = ref<HSCMember[]>([]);
  const selectedMembers = ref<HSCMember[]>([]);
  const filteredMemberName = ref<string>('');

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
      syncedMembers.value = {...data.value};
      filterMembers();
    }
    if (error.value && error.value.response) {
      useToast().error(`${error.value.response.status} - ${error.value.data.error}`)
    }
    sendRequest.value = pending.value;
  }

  async function addSelectedMembers() {
    if (sendRequest.value) return;
    sendRequest.value = true;

    const { data, error, pending} = await useFetch(
      `${config.apiBaseUrl}/corporations/${currentCorporationId.value}/sync-members/`,
      {
        method: `POST`,
        body: {
          corporationId: currentCorporationId.value,
          selectedMembers: selectedMembers.value
        },
        headers: [
        ['Corporation-Secret', getCorporationSecret(currentCorporationId.value)]
        ]
      }
    )

    if (data.value) {
      setCorporationDetails(data.value)
      emit('closePopup');
    }
    if (error.value && error.value.response) {
      useToast().error(`${error.value.response.status} - ${error.value.data.error}`)
    }
    sendRequest.value = pending.value;
  }

  function filterMembers(): void {
    if (
      filteredMemberName.value === ''
      && syncedMembers.value
      && syncedMembers.value.data
    ) {
      filteredMembers.value = syncedMembers.value.data
    } else if (
      filteredMemberName.value !== ''
      && syncedMembers.value
      && syncedMembers.value.data
    ) {
      const regex = new RegExp(filteredMemberName.value, 'i');
      filteredMembers.value = syncedMembers.value.data.filter(member => regex.test(member.name))
    }
  }

  function toggleSelection(member: HSCMember): void {
    if (selectedMembers.value) {
      const idx = selectedMembers.value.findIndex(obj => obj.id == member.id)
      if (idx !== -1) {
        selectedMembers.value.splice(idx, 1)
      } else {
        selectedMembers.value.push(member);
      }

    }
  }

  function isSelectedMember (member: HSCMember): boolean {
    if (selectedMembers.value) {
      return selectedMembers.value.some(obj => obj.id === member.id);
    }
    return false
  }
</script>

<template>
  <div class="p-2">
    <UiInfo v-if="corporation && !corporation.roleId">
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
      <div class="text-center" v-if="!syncedMembers">
        <UiParagraph>
          You can import data from Hades Star Compendium and Discord Bot. 
        </UiParagraph>
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
      <div v-else class="max-w-screen-lg">
        <div class="flex items-center">
          <div class="grow">
            <UiParagraph v-if="corporation">
              Select members you want to add to <strong>{{ corporation.name }}</strong>
            </UiParagraph>
          </div>
          <div class="grow-0">
            <UiInputText
              v-model="filteredMemberName"
              v-focus
              :name="'membersFilter'"
              :type="'text'"
              :value="filteredMemberName"
              :placeholder="'Search by name'"
              @keyup="filterMembers()"
            />
          </div>
        </div>        
        <UiButton
          v-for="member in filteredMembers"
          :key="member.id"
          :text="member.name"
          :size="'sm'"
          :layout="isSelectedMember(member) ? '' : 'transparent'"
          class="mr-1 mb-1"
          @click="toggleSelection(member)"
        />
        <UiDivider class="mt-4"/>
        <UiButton 
          :text="'Add selected members'"
          :size="'sm'"
          @click="addSelectedMembers()"
        />
      </div>
    </div>
  </div>
</template>