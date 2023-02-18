<script setup lang="ts">
  import { CorporationDetails } from '@/types/corporation';
  import { Member } from '@/types/member';
  import { Attribute } from '@/types/ship-attribute';
  import * as pkg from "vue-toastification"
  const { useToast } = pkg


  const route = useRoute();
  const config = useRuntimeConfig();
  const isLoading = ref(true);
  const sendRequest = ref(false);
  const incorrectSecret = ref(false);
  const editMember = ref(false);
  const clickedMember = ref<Member | null>();
  const clickedAttribute = ref<Attribute | null>();
  const addMemberPopup = ref(false);
  const changeSecretPopup = ref(false);
  const memberDetailsPopup = ref(false);
  const memberAttributePopup = ref(false);
  const editCorporationPopup = ref(false);
  const detailsVisible = ref(false);
  
  const { corporation, getCorporationSecret, setCorporationDetails } = useCorporationDetails();
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
      setCorporationDetails(responseJson as CorporationDetails)
      isLoading.value = false;
      incorrectSecret.value = false;
    }).catch((error) => {
      useToast().error(`${error.status} - ${error.statusText}`)
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
          useToast().error(`${error.value.response.status} - ${error.value.response.statusText}`)
        }
      }
      sendRequest.value = pending.value
    }

  function hideAllPopups(): void {
    editMember.value = false;
    addMemberPopup.value = false;
    changeSecretPopup.value = false;
    memberDetailsPopup.value = false;
    memberAttributePopup.value = false;
    editCorporationPopup.value = false;
    popupToggleVisibility();
  }

  function showMemberDetails(member: Member): void {
    clickedMember.value = member;
    memberDetailsPopup.value = true;
    popupToggleVisibility();
  }

  function showAttributeDetails(attribute: Attribute, member: Member) {
    clickedMember.value = member;
    clickedAttribute.value = attribute;
    memberAttributePopup.value = true;
    popupToggleVisibility()
  }

  const attributeButtonLayout = (currentValue: Number, attributeValue: Number) => {
    return currentValue === attributeValue ? '' : 'transparent'
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
          :goBackBtn="true"
          :corporationId="route.params.id.toString()"
          @corporation-secret-change="fetchCorporationData()"
        />
      </div>
      <div v-else>
        <div v-if="corporation">
          <div class="flex">
            <div class="grow">
              <UiHeaderH1
                :nav-back="'/corporations'"
              >
                {{ corporation.name }}
              </UiHeaderH1>
            </div>
            <div class="grow-0">
              <font-awesome-icon
                class="cursor-pointer float-right ml-1 text-3xl text-gray-200"
                icon="fa-duotone fa-circle-info"
                @click="detailsVisible = !detailsVisible"
              />
            </div>
          </div>
          <UiDivider />
          <CorporationsDetails 
            :corporation="corporation"
            class="max-h-0 overflow-hidden transition-all duration-500 ease-in-out"
            :class="{'max-h-[24rem]': detailsVisible}"
          />
          <CorporationsNextWsStats 
            :members="corporation.members"
          />
          <div
            v-if="corporation.members && corporation.members.length > 0"
            class="flex mt-2">
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
            <div class="flex overflow-x-scroll w-full ml-2">
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
                        class="cursor-pointer"
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
                        class="cursor-pointer"
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
                        class="cursor-pointer"
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
                        class="cursor-pointer"
                        @click="showAttributeDetails(attribute, member)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            class="text-center mt-4">
            <UiCard>
              <UiHeaderH1>Ups!</UiHeaderH1>
              <UiParagraph>No members yet. Please add first member</UiParagraph>
              <UiButton 
                :text="'Add Member'"
                @click="addMemberPopup = true; popupToggleVisibility()"
              />
            </UiCard>
          </div>
          <UiFooter>
            <UiButton 
              :text="'Add member'"
              :layout="'transparent'"
              :size="'sm'"
              class="mr-2"
              @click="addMemberPopup = true; popupToggleVisibility()"
            />
            <UiButton 
              :text="'Change secret'"
              :layout="'transparent'"
              :size="'sm'"
              class="mr-2"
              @click="changeSecretPopup = true; popupToggleVisibility()"
            />
            <UiButton 
              :text="'Edit corporation'"
              :layout="'transparent'"
              :size="'sm'"
              class="mr-2"
              @click="editCorporationPopup = true; popupToggleVisibility()"
            />
          </UiFooter>
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

    <ClientOnly v-if="isPopupVisible && editCorporationPopup">
      <Teleport to="#popup-container">
        <UiPopup
          @close-popup="hideAllPopups()"
        >
          <div class="p-4">
            <CorporationsEdit
              :corporationId="corporationId"
              @close-popup="hideAllPopups();"
            />
          </div>
        </UiPopup>
      </Teleport>
    </ClientOnly>

    <ClientOnly v-if="isPopupVisible && addMemberPopup">
      <Teleport to="#popup-container">
        <UiPopup
          @close-popup="hideAllPopups()"
        >
          <MembersAdd
            :corporationId="corporationId"
            @cancel-add-member="hideAllPopups();"
            @sucess-add-member="hideAllPopups();"
          />
        </UiPopup>
      </Teleport>
    </ClientOnly>

    <ClientOnly v-if="isPopupVisible && changeSecretPopup">
      <Teleport to="#popup-container">
        <UiPopup
          @close-popup="hideAllPopups()"
        >
          <div class="p-4">
            <CorporationsSecret
              :corporationId="corporationId"
              :goBackBtn="false"
              :cancelBtn="true"
              :setNewSecret="true"
              @cancel-change-secret="hideAllPopups()"
              @corporation-secret-change="hideAllPopups()"
            />
          </div>
        </UiPopup>
      </Teleport>
    </ClientOnly>

    <ClientOnly v-if="isPopupVisible && memberDetailsPopup">
      <Teleport to="#popup-container">
        <UiPopup
          @close-popup="hideAllPopups()"
        >
          <div v-if="!editMember" class="p-4">
            <MembersDetails
              :member="clickedMember"
              :corporationId="corporationId"
              @edit-member="editMember = true"
              @success-delete-member="hideAllPopups();"
            />
          </div>
          <div
            v-if="editMember"
            class="p-4"
          >
            <MembersEdit
              :member="clickedMember"
              :corporationId="corporationId"
              @cancel-edit-member="hideAllPopups();"
              @success-edit-member="hideAllPopups();"
            />
          </div>
        </UiPopup>
      </Teleport>
    </ClientOnly>

    <ClientOnly v-if="isPopupVisible && memberAttributePopup">
      <Teleport to="#popup-container">
        <UiPopup
          @close-popup="hideAllPopups()"
        >
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