<script setup lang="ts">
  import { CorporationDetails } from '@/types/corporation';
  import { Member } from '@/types/member';
  import { Attribute } from '@/types/ship-attribute';
  import { useToast } from "vue-toastification";

  const route = useRoute();
  const config = useRuntimeConfig();
  const { corporation } = useCorporationDetails();
  const { data, error, pending, refresh } = await useLazyAsyncData('corporation', () => $fetch(`${config.apiBaseUrl}/corporations/${route.params.id}/`))
  const { isPopupVisible, popupToggleVisibility } = usePopup();
  const clickedMember = ref<Member | undefined>()
  const clickedMemberId = ref<String>()
  const clickedAttribute = ref<Attribute | undefined>()
  const sendRequest = ref(false);
  const toast = useToast();
  
  function setDetails(details: CorporationDetails) {
    corporation.value = details;
  }
  
  function showMemberDetails(member: Member) {
    clickedMember.value = member
    popupToggleVisibility()
  }

  function showAttributeDetails(attribute: Attribute, memberId: String) {
    clickedMemberId.value = memberId
    clickedAttribute.value = attribute
    popupToggleVisibility()
  }

  async function setAttributeLevel(attribute: Attribute, level:Number) {
    if (sendRequest.value) {
      return
    }
    sendRequest.value = true;
    
    const { data, error, pending } = await useFetch<Attribute>(
      `${config.apiBaseUrl}/members/${clickedMemberId.value}/attribute/`,
      {
        method: 'PATCH',
        body: {
          attributeId: attribute.id,
          value: level,
          attributeName: attribute.name
        }
      }
    );
    
    if (data.value) {
      attribute.value = data.value.currentValue
      clickedMemberId.value = undefined
      clickedAttribute.value = undefined
      popupToggleVisibility()
    }
    if (error.value) {
      if (error.value.response) {
        toast.error(`${error.value.response.status} - ${error.value.response.statusText}`)
      }
    }
    sendRequest.value = pending.value
  }

  const attributeButtonLayout = (currentValue: Number, attributeValue: Number) => {
    return currentValue === attributeValue ? '' : 'transparent'
  }

  watch (data, (newData) => {
    setDetails(newData as CorporationDetails)
  })
  watch (isPopupVisible, (popupVisibility) => {
    if (popupVisibility === false) {
      clickedMember.value = undefined
      clickedAttribute.value = undefined
    }
  })
  if (corporation.value === undefined && !pending.value)  {
    refresh();
  }
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
            {{ member.name }}
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
            :key="`nextWS_${member.id}`"
          />
        </div>
        <div class="flex overflow-x-scroll w-36 ml-2">
          <div class="min-w-fit flex">
            <div>
              <UiHeaderH2>
                Weapons
              </UiHeaderH2>
              <div>
                <div class="flex">
                  <MembersAttributeCard
                    v-if="corporation.members && corporation.members.length > 0 && corporation.members[0].attributes"
                    v-for="attribute in corporation.members[0].attributes.weapon"
                    :key="attribute.name"
                    :attribute="attribute"
                    :iconsOnly="true"
                  />
                </div>
                <div
                  v-for="member in corporation.members"
                  :key="member.id"
                  class="flex w-full"
                >
                  <MembersAttributeCard
                    v-if="member.attributes"
                    v-for="attribute in member.attributes.weapon"
                    :key="attribute.name"
                    :attribute="attribute"
                    @click="showAttributeDetails(attribute, member.id)"
                  />
                </div>
              </div>
            </div>
            <div class="ml-2">
              <UiHeaderH2>
                Shields
              </UiHeaderH2>
              <div>
                <div class="flex">
                  <MembersAttributeCard
                    v-if="corporation.members && corporation.members.length > 0 && corporation.members[0].attributes"
                    v-for="attribute in corporation.members[0].attributes.shield"
                    :key="attribute.name"
                    :attribute="attribute"
                    :iconsOnly="true"
                  />
                </div>
                <div
                  v-for="member in corporation.members"
                  :key="member.id"
                  class="flex w-full"
                >
                  <MembersAttributeCard
                    v-if="member.attributes"
                    v-for="attribute in member.attributes.shield"
                    :key="attribute.name"
                    :attribute="attribute"
                    @click="showAttributeDetails(attribute, member.id)"
                  />
                </div>
              </div>
            </div>
            <div class="ml-2">
              <UiHeaderH2>
                Support
              </UiHeaderH2>
              <div>
                <div class="flex">
                  <MembersAttributeCard
                    v-if="corporation.members && corporation.members.length > 0 && corporation.members[0].attributes"
                    v-for="attribute in corporation.members[0].attributes.support"
                    :key="attribute.name"
                    :attribute="attribute"
                    :iconsOnly="true"
                  />
                </div>
                <div
                  v-for="member in corporation.members"
                  :key="member.id"
                  class="flex w-full"
                >
                  <MembersAttributeCard
                    v-if="member.attributes"
                    v-for="attribute in member.attributes.support"
                    :key="attribute.name"
                    :attribute="attribute"
                    @click="showAttributeDetails(attribute, member.id)"
                  />
                </div>
              </div>
            </div>
            <div class="ml-2">
              <UiHeaderH2>
                Mining
              </UiHeaderH2>
              <div>
                <div class="flex">
                  <MembersAttributeCard
                    v-if="corporation.members && corporation.members.length > 0 && corporation.members[0].attributes"
                    v-for="attribute in corporation.members[0].attributes.mining"
                    :key="attribute.name"
                    :attribute="attribute"
                    :iconsOnly="true"
                  />
                </div>
                <div
                  v-for="member in corporation.members"
                  :key="member.id"
                  class="flex w-full"
                >
                  <MembersAttributeCard
                    v-if="member.attributes"
                    v-for="attribute in member.attributes.mining"
                    :key="attribute.name"
                    :attribute="attribute"
                    @click="showAttributeDetails(attribute, member.id)"
                  />
                </div>
              </div>
            </div>
            <div class="ml-2">
              <UiHeaderH2>
                Trade
              </UiHeaderH2>
              <div>
                <div class="flex">
                  <MembersAttributeCard
                    v-if="corporation.members && corporation.members.length > 0 && corporation.members[0].attributes"
                    v-for="attribute in corporation.members[0].attributes.trade"
                    :key="attribute.name"
                    :attribute="attribute"
                    :iconsOnly="true"
                  />
                </div>
                <div
                  v-for="member in corporation.members"
                  :key="member.id"
                  class="flex w-full"
                >
                  <MembersAttributeCard
                    v-if="member.attributes"
                    v-for="attribute in member.attributes.trade"
                    :key="attribute.name"
                    :attribute="attribute"
                    @click="showAttributeDetails(attribute, member.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ClientOnly v-if="isPopupVisible && clickedMember">
      <Teleport to="#popup-container">
        <UiPopup>
          <div class="p-4">
            <UiHeaderH2>{{ clickedMember?.name }}</UiHeaderH2>
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

    <ClientOnly v-if="isPopupVisible && clickedAttribute">
      <Teleport to="#popup-container">
        <UiPopup>
          <div class="p-4">
            <UiHeaderH2>{{ $reslugify(clickedAttribute.name) }}</UiHeaderH2>
            <UiDivider />
            <div class="text-center">
              <UiParagraph>
                Choose your current {{ $reslugify(clickedAttribute.name) }} level.
              </UiParagraph>
              <UiDivider />
              <UiButton 
                v-for="idx in clickedAttribute.max"
                class="m-1"
                :key="idx"
                :text="`${idx}`"
                :layout="attributeButtonLayout(idx, clickedAttribute.value)"
                @click="setAttributeLevel(clickedAttribute!,  idx)"
              />
            </div>
          </div>
        </UiPopup>
      </Teleport>
    </ClientOnly>
    
  </div>
</template>