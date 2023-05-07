<script setup lang="ts">
  import * as pkg from "vue-toastification";
  import { HSCMember } from "@/types/hscmember";
  import { CorporationDetails } from '@/types/corporation';
  const { useToast } = pkg;

  const { corporation, currentCorporationId, getCorporationSecret, setCorporationDetails } = useCorporationDetails();
  const config = useRuntimeConfig();
  const emit = defineEmits(['editCorporation', 'closePopup']);
  const sendRequest = ref<boolean>(false);
  const syncedMembers = ref<HSCMember[]>([]);
  const filteredMembers = ref<HSCMember[]>([]);
  const selectedMembers = ref<HSCMember[]>([]);
  const filteredMemberName = ref<string>('');
  const videoPlayer = ref<HTMLVideoElement | null>(null)

  async function syncMembers() {
    if (sendRequest.value) return;

    sendRequest.value = true;
    
    const { data, error, pending } = await useFetch<HSCMember[]>(
      `${config.apiBaseUrl}/corporations/${currentCorporationId.value}/sync-members/`,
      {
        method: `GET`,
        headers: [
          ['Corporation-Secret', getCorporationSecret(currentCorporationId.value)]
        ]
      }
    )
    
    if (data.value) {    
      syncedMembers.value = data.value.filter(item => !corporation.value?.members.some(member => member.hscId === item.id));
      filterMembers();
    }
    if (error.value && error.value.response) {
      useToast().error(`${error.value.response.status} - ${error.value.data.error}`)
    }
    sendRequest.value = pending.value;
  }

  async function syncTechLevels() {
    if (sendRequest.value) return;
    sendRequest.value = true;
    const { data, error, pending } = await useFetch(
      `${config.apiBaseUrl}/corporations/${currentCorporationId.value}/sync-tech/`,
      {
        method: `GET`,
        headers: [
          ['Corporation-Secret', getCorporationSecret(currentCorporationId.value)]
        ]
      }
    )

    if (data.value) {
      setCorporationDetails({...data.value as CorporationDetails})
      emit('closePopup');
      useToast().success(`Members tech levels sync finished.`)
      
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
      setCorporationDetails({...data.value as CorporationDetails})
      emit('closePopup');
      useToast().success(`Members sync finished. Please verify their timezones :)`)
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
    ) {
      filteredMembers.value = syncedMembers.value
    } else if (
      filteredMemberName.value !== ''
      && syncedMembers.value
    ) {
      const regex = new RegExp(filteredMemberName.value, 'i');
      filteredMembers.value = syncedMembers.value.filter(member => regex.test(member.name))
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
        ref="videoPlayer"
        class="mx-auto p-2 border border-gray-600 rounded mb-1"
        width="972" height="578" muted>
        <source
        :src="`${config.imagesUrl}/videos/copy-role-id.mp4`" type="video/mp4"
        >
        Your browser does not support the video tag.
      </video> 
      <div
        v-if="videoPlayer"
      >
        <UiButton
          @click="videoPlayer.play();"
          :text="'Play'"
          :layout="'transparent'"
          :size="'sm'"
          class="mr-1"
        />
        <UiButton
          @click="videoPlayer.pause();"
          :text="'Pause'"
          :layout="'transparent'"
          :size="'sm'"
          class="mr-1"
        />
        <UiButton
          @click="videoPlayer.pause(); videoPlayer.currentTime = 0;"
          :text="'Restart'"
          :layout="'transparent'"
          :size="'sm'"
        />
      </div>
      <div class="text-center">
        <em class="my-2 block">Select your Corp role Id and copy/paste it to this app.</em>
        <UiButton
          :text="'Edit Corporation'"
          class="mx-auto"
          @click="emit('editCorporation')"
        />
      </div>
    </UiInfo>
    <div v-else>
      <div class="text-center" v-if="syncedMembers.length === 0">
        <UiParagraph>
          You can import data from Hades Star Compendium and Discord Bot. 
        </UiParagraph>
        <UiParagraph>Please choose one of sychronization</UiParagraph>
        <div v-if="!sendRequest">
          <UiButton
            :text="'Corporation members'"
            :layout="'transparent'"
            :size="'sm'"
            class="mr-2"
            @click="syncMembers()"
          />
          <UiButton
            :text="'Tech levels for current members'"
            :layout="'transparent'"
            :size="'sm'"
            @click="syncTechLevels()"
          />
        </div>
        <div v-else>
          <UiLoader class="text-4xl"/>
        </div>
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
          v-if="!sendRequest"
          :text="'Add selected members'"
          :size="'sm'"
          :layout="'transparent'"
          @click="addSelectedMembers()"
        />
        <div class="text-center" v-else>
          <UiLoader class="text-4xl"/>
        </div>
      </div>
    </div>
  </div>
</template>