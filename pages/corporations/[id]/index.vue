<script setup lang="ts">
  import { Member } from '@/types/member';
  import { Attribute } from '@/types/ship-attribute';
  import * as pkg from "vue-toastification"
  const { useToast } = pkg
  

  const route = useRoute();
  const config = useRuntimeConfig();
  const sendRequest = ref(false);
  const editMember = ref(false);
  const clickedMember = ref<Member | null>();
  const clickedAttribute = ref<Attribute | null>();
  const addMemberPopup = ref(false);
  const changeSecretPopup = ref(false);
  const memberDetailsPopup = ref(false);
  const memberAttributePopup = ref(false);
  const editCorporationPopup = ref(false);
  const showMembersTime = ref(false);
  const hSyncPopup = ref(false);
  const detailsVisible = ref(false);
  
  const { corporation, currentCorporationId, loadingCorporation, getCorporationSecret, fetchCorporationData } = useCorporationDetails();
  const { isPopupVisible, popupToggleVisibility } = usePopup();
  currentCorporationId.value = typeof(route.params.id) === 'string' ? route.params.id : route.params.id[0]

  fetchCorporationData(currentCorporationId.value);
  
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
            set: level,
            attributeName: attribute.name,
            corporation: currentCorporationId.value,
          },
          headers: [
            ['Corporation-Secret', getCorporationSecret(currentCorporationId.value)]
          ],
        }
      );
      
      if (data.value) {
        attribute.set = data.value.set
        clickedMember.value = undefined
        clickedAttribute.value = undefined
        hideAllPopups()
        useToast().success('Updated successfully')
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
    hSyncPopup.value = false;
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

  function showHsyncPopup(): void {
    hSyncPopup.value = true;
    popupToggleVisibility();
  }

  const attributeButtonLayout = (currentValue: Number, attributeValue: Number) => {
    return currentValue === attributeValue ? '' : 'transparent'
  }

  
</script>

<template>
  <div>
    <div v-if="loadingCorporation">
      <UiCard>
        <UiLoader /> Fetching data...
      </UiCard>
    </div>
    <div v-else>
      <div>
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
          <CorporationsDetails 
            class="max-h-0 overflow-hidden transition-all duration-500 ease-in-out"
            :class="{'max-h-[28rem]': detailsVisible}"
            :corporation="corporation"
            @h-sync="showHsyncPopup()"
          />
          <div class="grid grid-cols-1 gap-1 lg:flex">
            <div>
              <CorporationsNextWsStats 
                :members="corporation.members"
              />
            </div>
            <div>
              <CorporationsFiltersCard />
            </div>
            <div>
              <CorporationsPowerChart />
            </div>
          </div>
          <div
            v-if="corporation.members && corporation.members.length > 0"
            class="flex mt-2">
            <div class="max-w-fit min-w-fit">
              <UiHeaderH2
                class="mb-6 pb-1"
              >
                Username
              </UiHeaderH2>
              <UiButton 
                :text="'Show Time'"
                :layout="showMembersTime ? '': 'transparent'"
                :size="'sm'"
                class="mb-1"
                @click="showMembersTime = !showMembersTime"
              />
              <span
                v-for="member in corporation.members"
                :key="member.id"
              >
                <UiCard
                  v-if="member.isVisible"
                  @click="showMemberDetails(member)"
                  class="cursor-pointer relative mb-1"
                  :class="{'border-l-4 border-blue-500': member.hscId}"
                  v-tooltip.right="{content: 'Click for member details', delay: {show: 1000, hide: 0}}"
                >
                  {{ member.name }}
                  <MembersCurrentTime
                    v-if="showMembersTime"
                    :member-timezone="member.timeZone"
                  />
                </UiCard>
              </span>
            </div>
            <div class="ml-2 min-w-fit">
              <UiHeaderH2
                class="mb-14 pb-1"
              >
                Next scan
              </UiHeaderH2>
              <span
                v-for="member in corporation.members"
                :key="member.id"
              >
                <CorporationsNextWs
                  v-if="member.isVisible"
                  :member="member"
                  :corporationId="currentCorporationId"
                  :key="`nextWS_${member.id}`"
                />
              </span>
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
                        v-for="attribute in corporation.members[0].attributes.Weapon"
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
                        v-if="member.attributes && member.isVisible"
                        v-for="attribute in member.attributes.Weapon"
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
                        v-for="attribute in corporation.members[0].attributes.Shield"
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
                        v-if="member.attributes && member.isVisible"
                        v-for="attribute in member.attributes.Shield"
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
                        v-for="attribute in corporation.members[0].attributes.Support"
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
                        v-if="member.attributes && member.isVisible"
                        v-for="attribute in member.attributes.Support"
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
                        v-for="attribute in corporation.members[0].attributes.Mining"
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
                        v-if="member.attributes && member.isVisible"
                        v-for="attribute in member.attributes.Mining"
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
                        v-for="attribute in corporation.members[0].attributes.Trade"
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
                        v-if="member.attributes && member.isVisible"
                        v-for="attribute in member.attributes.Trade"
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
                :size="'sm'"
                :layout="'transparent'"
                class="mr-2"
                @click="addMemberPopup = true; popupToggleVisibility()"
              />
              <UiButton
                :text="'Sync data with HS Compendium'"
                :size="'sm'"
                :layout="'transparent'"
                @click="showHsyncPopup()"
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
      </div>
    </div>

    <ClientOnly v-if="isPopupVisible && editCorporationPopup">
      <Teleport to="#popup-container">
        <UiPopup
          @close-popup="hideAllPopups()"
        >
          <div class="p-4">
            <CorporationsEdit
              :corporationId.value="currentCorporationId"
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
            :corporationId.value="currentCorporationId"
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
              :corporationId.value="currentCorporationId"
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

    <ClientOnly v-if="isPopupVisible && memberDetailsPopup && clickedMember">
      <Teleport to="#popup-container">
        <UiPopup
          @close-popup="hideAllPopups()"
        >
          <div v-if="!editMember" class="p-4">
            <MembersDetails
              :member="clickedMember"
              :corporationId.value="currentCorporationId"
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
              :corporationId.value="currentCorporationId"
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
          <div
            v-if="clickedAttribute"
            class="p-4">
            <UiHeaderH2>{{ $reslugify(clickedAttribute.name) }}</UiHeaderH2>
            <UiDivider />
            <div class="text-center">
              <UiParagraph>
                Choose your current {{ $reslugify(clickedAttribute.name) }} level.
              </UiParagraph>
              <UiDivider />
              <UiButton 
                class="m-1"
                :text="'0'"
                :layout="attributeButtonLayout(0, clickedAttribute.set)"
                @click="setAttributeLevel(clickedAttribute!,  0)"
              />
              <UiButton 
                v-for="idx in clickedAttribute.max"
                class="m-1"
                :key="idx"
                :text="`${idx}`"
                :layout="attributeButtonLayout(idx, clickedAttribute.set)"
                @click="setAttributeLevel(clickedAttribute!,  idx)"
              />
            </div>
          </div>
        </UiPopup>
      </Teleport>
    </ClientOnly>

    <ClientOnly
      v-if="isPopupVisible && hSyncPopup"
    >
      <Teleport to="#popup-container">
        <UiPopup
          :header="'HS Compendium Data Sync'"
          @close-popup="hideAllPopups()"
        >
          <CorporationsHSync 
            :corporationId.value="currentCorporationId"
            @edit-corporation="hideAllPopups(); editCorporationPopup = true; popupToggleVisibility()"
            @close-popup="hideAllPopups()"
          />
        </UiPopup>
      </Teleport>
    </ClientOnly>
  </div>
</template>