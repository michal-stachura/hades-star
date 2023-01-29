<script setup lang="ts">
  import { CorporationDetails } from '@/types/corporation';
  import { Member } from '@/types/member';
  import { Attribute } from '@/types/ship-attribute';
  import { useToast } from "vue-toastification";

  const route = useRoute();
  const config = useRuntimeConfig();
  const toast = useToast();
  const { corporation, getCorporationSecret, setCorporationSecret } = useCorporationDetails();
  const { isPopupVisible, popupToggleVisibility } = usePopup();
  const clickedMember = ref<Member | undefined>();
  const clickedMemberId = ref<String>();
  const clickedAttribute = ref<Attribute | undefined>();
  const sendRequest = ref(false);
  // const corporationSecret = ref();

  const isLoading = ref(true);
  const incorrectSecret = ref(false);
  // const headers = useRequestHeaders().append('test', 'abc');
  // let headers = useRequestHeaders();
  // const headers = {
  //   Accept: '*/*',
  //   Connection: 'keep-alive',
  //   Host: '127.0.0.0.1:8000',
  //   Origin: 'http://localhost:3000',
  //   Referer: 'http://localhost:3000',
  //   Test: 'abc'
  // }
  // headers['test'] = 'abc'

  
  // const { data, error, pending, refresh } = await useLazyAsyncData('corporation', () => $fetch(
  //   `${config.apiBaseUrl}/corporations/${route.params.id}/`,
  //   )
  // )

  function companySetDetails(companyData: CorporationDetails) {
    setDetails(companyData)
    isLoading.value = false;
    incorrectSecret.value = false;
  }
  function fetchingDataError() {
    isLoading.value = false;
    incorrectSecret.value = true;
  } 
  async function getCorporationData() {
    console.log('getCorporationData')
    const { data, error, pending, refresh } = await useFetch(
      `${config.apiBaseUrl}/corporations/${route.params.id}/`,
      {
        headers: [['Corporation-Secret', getCorporationSecret(route.params.id)]],
      }
    )
    
    if (data.value) {
      companySetDetails(data.value as CorporationDetails);      
    }
    watch (data, (newData) => {
      companySetDetails(newData as CorporationDetails)
    })
    if (error.value) {
      data.value = null;
      fetchingDataError();
    }
    watch (error, (newError) => {
      data.value = null;
      fetchingDataError();
    })
  }

  function setDetails(details: CorporationDetails) {
    corporation.value = details;
  }

  if (process.client) {
    
    // const { data, error, pending, refresh } = await useFetch(
    //   `${config.apiBaseUrl}/corporations/${route.params.id}/`,
    //   {
    //     headers: [['Corporation-Secret', getCorporationSecret(route.params.id)]],
    //   }
    // )


    // if (corporation.value === undefined && !pending.value)  {
    //   refresh();
    // }

    
    
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
            attributeName: attribute.name,
            corporationId: route.params.id,
            corporationSecret: corporationSecret.value,
          },
        }
      );
      
      if (data.value) {
        attribute.value = data.value.value
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

    
    watch (isPopupVisible, (popupVisibility) => {
      if (popupVisibility === false) {
        clickedMember.value = undefined
        clickedAttribute.value = undefined
      }
    })

    getCorporationData();
    
    onMounted(() => {
      getCorporationData();
    })
  }
  

</script>

<template>
  <div>
    <div v-if="isLoading">
      <UiCard>
        Fetching data...
      </UiCard>
    </div>
    <div v-else>
      <div v-if="incorrectSecret">
        <CorporationsSecret
          :corporationId="route.params.id.toString()"
          @corporationSecretChange="getCorporationData()"
        />
      </div>
      <div v-else>
        <UiHeaderH1
          :nav-back="'/corporations'"
        >
          {{ corporation.name }} details
        </UiHeaderH1>
        <UiDivider />
      </div>
    </div>

    <!-- <div v-if="!error && !pending && corporation">
      
      <div v-if="!getCorporationSecret(route.params.id)">
        <div
          class="mt-4"
        >
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
            :text="'Submit'"
            @click="setSecret(corporationSecret)"
          />
        </div>
      </div>
      <div v-else>
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
    </div> -->

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