<script setup lang="ts">
  import { Member } from '@/types/member';
  import corporationData from '@/data/corporationDetailts';
  
  const { corporation, wsReady, getWsReady } = useCorporationDetails();
  const { isPopupVisible, popupToggleVisibility } = usePopup();
  corporation.value = corporationData;
  getWsReady()
  const clickedMember = ref<Member | undefined>()

  function showMemberDetails(member: Member) {
    clickedMember.value = member
    popupToggleVisibility()
  }
</script>

<template>
  <div>
    <div v-if="corporation">
      <UiHeaderH1
        :nav-back="'/corporations'"
      >
        {{ corporation.name }} details
      </UiHeaderH1>
      <UiDivider />
      <div class="text-white">
        WS ready: {{ wsReady }}
      </div>
      <div class="flex">
        <div class="max-w-fit">
          <UiHeaderH2>
            Username
          </UiHeaderH2>
          <UiCard
            v-for="member in corporation.members"
            :key="member.id"
            @click="showMemberDetails(member)"
            class="cursor-pointer"
            v-tooltip.right="{content: 'Click for member details', delay: {show: 1000, hide: 0}}"
          >
            {{ member.username }}
          </UiCard>
        </div>
        <div class="ml-2">
          <UiHeaderH2>
            Next scan
          </UiHeaderH2>
          <CorporationsNextWs 
            v-for="member in corporation.members"
            :member="member"
            :key="member.id"
          />
        </div>
      </div>
    </div>
    <div v-else``>
      <UiHeaderH1>404</UiHeaderH1>
      <UiParagraph>Sorry Corporation not found</UiParagraph>
      <UiButton
        :text="'Go back'"
        @click="navigateTo('/corporations')"
      />
    </div>

    <ClientOnly v-if="isPopupVisible">
      <Teleport to="#popup-container">
        <UiPopup>
          <div class="p-4">
            <UiHeaderH2>{{ clickedMember?.username }}</UiHeaderH2>
            <UiDivider />
            <div class="flex text-gray-200">
              <div class="grow">
                <UiParagraph>Timezone</UiParagraph>
                <UiParagraph>Red Star Level</UiParagraph>
                <UiParagraph>BattleShip Level</UiParagraph>
                <UiParagraph>Max Mods</UiParagraph>
                <UiParagraph>Willing to be Leader</UiParagraph>
                <UiParagraph>Preferences</UiParagraph>
              </div>
              <div class="grow-0 text-right">
                <UiParagraph>{{ clickedMember?.timeZone || '-' }}</UiParagraph>
                <UiParagraph>{{ clickedMember?.rsLevel || '-' }}</UiParagraph>
                <UiParagraph>{{ clickedMember?.bsLevel || '-' }}</UiParagraph>
                <UiParagraph>{{ clickedMember?.maxMods || '-' }}</UiParagraph>
                <UiParagraph>{{ clickedMember?.asLeader || '-' }}</UiParagraph>
                <UiParagraph>{{ clickedMember?.preferences?.join(',') || '-' }}</UiParagraph>
              </div>
            </div>
          </div>
        </UiPopup>
      </Teleport>
    </ClientOnly>
  </div>
</template>