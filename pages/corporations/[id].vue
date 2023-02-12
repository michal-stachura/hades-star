<script setup lang="ts">
  import { CorporationDetails } from '@/types/corporation';
  import { useToast } from "vue-toastification";
  import { Member } from '@/types/member';
  import { Attribute } from '@/types/ship-attribute';

  const route = useRoute();
  const config = useRuntimeConfig();
  const isLoading = ref(true);
  const sendRequest = ref(false);
  const incorrectSecret = ref(false);
  const editMember = ref(false);
  const clickedMember = ref<Member | null>();
  const clickedAttribute = ref<Attribute | null>();
  const addMemberPopup = ref(false);
  const toast = useToast();
  const { corporation, getCorporationSecret } = useCorporationDetails();
  const { isPopupVisible, popupToggleVisibility } = usePopup();
  const corporationId: string = typeof(route.params.id) === 'string' ? route.params.id : route.params.id[0]

  async function fetchCorporationData() {
    corporation.value = null;
    
    await fetch(
      `${config.apiBaseUrl}/corporations/${route.params.id}/`,
      {
        headers: [['Corporation-Secret', getCorporationSecret(corporationId)]],
      }
    ).then((response) => {
      if (response.ok) {
        return response.json()
      }
      return Promise.reject(response);
    }).then((responseJson) => {
      corporation.value = responseJson as CorporationDetails
      isLoading.value = false;
      incorrectSecret.value = false;
    }).catch((error) => {
      toast.error(`${error.status} - ${error.statusText}`)
      isLoading.value = false;
      incorrectSecret.value = true;
    })
  }

  async function setAttributeLevel(attribute: Attribute, level:Number) {
      if (sendRequest.value) {
        return
      }
      sendRequest.value = true;

      const { data, error, pending } = await useFetch<Attribute>(
        `${config.apiBaseUrl}/members/${clickedMember.value!.id}/attribute/`,
        {
          method: 'PATCH',
          body: {
            attributeId: attribute.id,
            value: level,
            attributeName: attribute.name,
            corporationId: route.params.id,
          },
          headers: [
            ['Corporation-Secret', getCorporationSecret(corporationId)]
          ],   
        }
      );
      
      if (data.value) {
        attribute.value = data.value.value
        clickedMember.value = undefined
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

  function showMemberDetails(member: Member): void {
    editMember.value = false;
    clickedAttribute.value = null;
    clickedMember.value = member;
    addMemberPopup.value = false;
    popupToggleVisibility();
  }

  function hideMemberDetails(): void {
    editMember.value = false;
    clickedAttribute.value = null;
    clickedMember.value = null;
    addMemberPopup.value = false;
    popupToggleVisibility();
  }

  function showAttributeDetails(attribute: Attribute, member: Member) {
    clickedMember.value = member;
    clickedAttribute.value = attribute;
    addMemberPopup.value = false;
    popupToggleVisibility()
  }

  const attributeButtonLayout = (currentValue: Number, attributeValue: Number) => {
    return currentValue === attributeValue ? '' : 'transparent'
  }

  function showAddMemberPopup() {
    addMemberPopup.value = true;
    popupToggleVisibility();
  }

  fetchCorporationData();
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
          @corporation-secret-change="fetchCorporationData()"
        />
      </div>
      <div v-else>
        <div v-if="corporation">
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
                :corporationId="corporationId"
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
                        class="cursor-pointer"
                        @click="showAttributeDetails(attribute, member)"
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
                        @click="showAttributeDetails(attribute, member)"
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
                        @click="showAttributeDetails(attribute, member)"
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
                        @click="showAttributeDetails(attribute, member)"
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
                        @click="showAttributeDetails(attribute, member)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-black/60 fixed bottom-0 left-0 w-full p-4">
            <UiButton 
              :text="'Add member'"
              :layout="'transparent'"
              :size="'sm'"
              class="mr-2"
              @click="showAddMemberPopup()"
            />
            <UiButton 
              :text="'Change secret'"
              :layout="'transparent'"
              :size="'sm'"
              class="mr-2"
            />
          </div>
        </div>
        <div v-else>
          <UiCard>
            Error fetching data. Please try again.
          </UiCard>
          <UiButton 
            :text="'Refresh'"
            class="ml-2"
            @click="fetchCorporationData()"
          />
          <UiButton 
            :text="'Go back'"
            class="ml-2"
            @click="navigateTo('/corporations')"
          />
        </div>
      </div>
    </div>

    <ClientOnly v-if="isPopupVisible && addMemberPopup">
      <Teleport to="#popup-container">
        <UiPopup>
          <MembersAdd 
            :corporationId="corporationId"
            @cancel-add-member="addMemberPopup = false; popupToggleVisibility();"
          />
        </UiPopup>
      </Teleport>
    </ClientOnly>


    <ClientOnly v-if="isPopupVisible && clickedMember && !clickedAttribute">
      <Teleport to="#popup-container">
        <UiPopup>
          <div v-if="!editMember" class="p-4">
            <MembersDetails
              :member="clickedMember"
              :corporationId="corporationId"
              @edit-member="editMember = true"
              @success-delete-member="hideMemberDetails()"
            />
          </div>
          <div
            v-if="editMember"
            class="p-4"
          >
            <MembersEdit
              :member="clickedMember"
              :corporationId="corporationId"
              @cancel-edit-member="editMember = false"
              @success-edit-member="hideMemberDetails()"
            />
          </div>
        </UiPopup>
      </Teleport>
    </ClientOnly>

    <ClientOnly v-if="isPopupVisible && clickedMember && clickedAttribute">
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