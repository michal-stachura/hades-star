<script setup lang="ts">
  import { Member } from '@/types/member';
  import { PropType } from 'vue';
  import { useToast } from 'vue-toastification';

  const props = defineProps({
    member: {
      type: Object as PropType<Member>,
      required: true,
    },
    corporationId: {
      type: String,
        required: true
    }
  });
  const config = useRuntimeConfig();
  const toast = useToast();
  const { getCorporationSecret, deleteCorporationMember } = useCorporationDetails();

  const emit = defineEmits(['editMember', 'successDeleteMember']);
  const confirmDelete = ref(false);
  const sendRequest = ref(false);

  async function deleteMember(): Promise<void> {
    if (sendRequest.value) return;
    sendRequest.value = true;

    const { pending } = await useFetch(
      `${config.apiBaseUrl}/members/${props.member.id}/remove-corporation/`,
      {
        method: 'DELETE',
        body: {
          corporationId: props.corporationId,
        },
        headers: [
          ['Corporation-Secret', getCorporationSecret(props.corporationId)]
        ],

        onResponse({ request, response, options }) {
          if (response.status === 204) {
            toast.success('Member removed');
            deleteCorporationMember(props.member.id);
            emit('successDeleteMember');
          } else {
            toast.error(`${response.status} - Error. Please try again later`)
          }
        }
      }
    )
    
    sendRequest.value = pending.value
  }
</script>


<template>
  <div>
    <UiHeaderH2>{{ member.name }}</UiHeaderH2>
    <UiDivider />
    <div class="flex text-gray-200">
      <div class="grow">
        <UiParagraph>Timezone</UiParagraph>
        <UiParagraph>Red Star Level</UiParagraph>
        <UiParagraph>BattleShip Level</UiParagraph>
        <UiParagraph>Max Mods</UiParagraph>
        <UiParagraph>Willing to be Leader</UiParagraph>
        <UiParagraph>White Star BattleShip Preferences:</UiParagraph>
      </div>
      <div class="grow-0 text-right">
        <UiParagraph>{{ member.timeZone || '-' }}</UiParagraph>
        <UiParagraph>{{ member.rsLevel || '-' }}</UiParagraph>
        <UiParagraph>{{ member.bsLevel || '-' }}</UiParagraph>
        <UiParagraph>{{ member.maxMods || '-' }}</UiParagraph>
        <UiParagraph>{{ member.asLeader === true ? 'Yes' : 'No' }}</UiParagraph>
      </div>
    </div>
    <div class="mb-4">
      <MembersWsShipRoles
        :shipRoles="props.member.wsShipRoles"
      />
    </div>
    <UiDivider />
    <UiInfo
      v-if="confirmDelete"
    >
      This action is permanent. Are you sure?
    </UiInfo>
    <UiButton
      :text="'Change data'"
      :layout="'transparent'"
      :size="'sm'"
      @click="emit('editMember')"
    />
    <span
      v-if="!confirmDelete"
      class="float-right"
    >
      <UiButton
        :text="'Delete member'"
        :layout="'transparent'"
        :size="'sm'"
        @click="confirmDelete = true"
      />
    </span>
    <span
      v-else
      class="float-right"
    >
      <UiButton
        :text="'No'"
        :layout="'transparent'"
        :size="'sm'"
        class="mr-2"
        @click="confirmDelete = false"
      />
      <UiButton
        :text="'Yes I\'m sure'"
        :layout="'transparent'"
        :size="'sm'"
        @click="deleteMember()"
      />
    </span>
  </div>
</template>