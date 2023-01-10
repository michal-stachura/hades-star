<script setup lang="ts">
  import { CorporationDetails } from '@/types/corporation';
  import { Member } from '@/types/member';
  const route = useRoute();
  const config = useRuntimeConfig();
  const { corporation } = useCorporationDetails();
  const { data, error, pending } = await useLazyAsyncData('corporation', () => $fetch(`${config.apiBaseUrl}/corporations/${route.params.id}/`))
  const { isPopupVisible, popupToggleVisibility } = usePopup();
  const clickedMember = ref<Member | undefined>()
  
  
  function setDetails(details: CorporationDetails) {
    corporation.value = details;
  }
  
  function showMemberDetails(member: Member) {
    clickedMember.value = member
    popupToggleVisibility()
  }

  watch (data, (newData) => {
    setDetails(newData as CorporationDetails)
  })
</script>

<template>
  <div>
    <div v-if="pending || error">
      <UiCard>
        {{ pending ? "Fetching data..." : error }}
      </UiCard>
      <UiButton 
        :text="'Go back'"
        @click="navigateTo('/corporations')"
      />
    </div>
    <div v-if="!error && !pending && corporation">
      <UiHeaderH1
        :nav-back="'/corporations'"
      >
        {{ corporation.name }} details
      </UiHeaderH1>
      <UiDivider />
      <CorporationsNextWsStats 
        :members="corporation.members"
      />
      <div class="flex mt-2">
        <div class="max-w-fit min-w-fit">
          <UiHeaderH2
            class="mb-14 pb-1"
          >
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
        <div class="ml-2 min-w-fit">
          <UiHeaderH2
            class="mb-14 pb-1"
          >
            Next scan
          </UiHeaderH2>
          <CorporationsNextWs 
            v-for="member in corporation.members"
            :member="member"
            :key="member.id"
          />
        </div>
        <div class="flex overflow-x-scroll w-36 ml-2">
          <div class="min-w-fit">
            <UiHeaderH2>
              Weapons
            </UiHeaderH2>
            <MembersAttributes
              :memberId="corporation.members![0].id"
              :attributeName="'Weapons'"
              :iconsOnly="true"
            />
            <MembersAttributes
              v-for="member in corporation.members"
              :key="`attr-${member.id}`"
              :memberId="member.id"
              :attributeName="'Weapons'"
            />
          </div>
          <div class="ml-2 min-w-fit">
            <UiHeaderH2>
              Shields
            </UiHeaderH2>
            <MembersAttributes
              :memberId="corporation.members![0].id"
              :attributeName="'Shields'"
              :iconsOnly="true"
            />
            <MembersAttributes
              v-for="member in corporation.members"
              :key="`attr-${member.id}`"
              :memberId="member.id"
              :attributeName="'Shields'"
            />
          </div>
          <div class="ml-2 min-w-fit">
            <UiHeaderH2>
              Support modules
            </UiHeaderH2>
            <MembersAttributes
              :memberId="corporation.members![0].id"
              :attributeName="'Support'"
              :iconsOnly="true"
            />
            <MembersAttributes
              v-for="member in corporation.members"
              :key="`attr-${member.id}`"
              :memberId="member.id"
              :attributeName="'Support'"
            />
          </div>
          <div class="ml-2 min-w-fit">
            <UiHeaderH2>
              Mining modules
            </UiHeaderH2>
            <MembersAttributes
              :memberId="corporation.members![0].id"
              :attributeName="'Mining'"
              :iconsOnly="true"
            />
            <MembersAttributes
              v-for="member in corporation.members"
              :key="`attr-${member.id}`"
              :memberId="member.id"
              :attributeName="'Mining'"
            />
          </div>
          <div class="ml-2 min-w-fit">
            <UiHeaderH2>
              Trade modules
            </UiHeaderH2>
            <MembersAttributes
              :memberId="corporation.members![0].id"
              :attributeName="'Trade'"
              :iconsOnly="true"
            />
            <MembersAttributes
              v-for="member in corporation.members"
              :key="`attr-${member.id}`"
              :memberId="member.id"
              :attributeName="'Trade'"
            />
          </div>
        </div>
      </div>
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