<script setup lang="ts">
  import { Member } from '@/types/member';
  import { PropType } from 'vue';
  import commonTimezones from '@/data/commonTimezones';
  import wsShipRoles from '@/data/wsShipRoles';
  import * as pkg from "vue-toastification"
  const { useToast } = pkg


  const props = defineProps({
    member: {
      type: Object as PropType<Member>,
      required: true,
    },
    corporationId: {
      type: String,
      required: true,
    }
  })
  const emit = defineEmits(['cancelEditMember', 'successEditMember']);
  
  const memberForm = reactive({
    name: props.member.name,
    timeZone: props.member.timeZone,
    rsLevel: props.member.rsLevel,
    bsLevel: props.member.bsLevel,
    maxMods: props.member.maxMods,
    asLeader: props.member.asLeader,
    wsShipRoles: props.member.wsShipRoles || [],
    corporationId: props.corporationId
  })

  const { getCorporationSecret, updateCorporationMember } = useCorporationDetails();
  const sendRequest = ref(false);
  const config = useRuntimeConfig();
  const toast = useToast();
  
  function bsLevel(): Number {
    if (memberForm.bsLevel < 6)
      return memberForm.bsLevel
    return 6
  }

  function wsShipRoleButtonLayout(shipRole: string): string {
    if (!memberForm.wsShipRoles.some(el => el === shipRole)) {
      return 'transparent'
    }
    return ''
  }

  function wsShipRoleAddOrRemove(shipRole: string): void {
    if (shipRole === 'A') {
      memberForm.wsShipRoles = ['A']
    } else {
      // Remove 'A'
      const idx = memberForm.wsShipRoles.indexOf('A');
      if (idx !== -1) {
        memberForm.wsShipRoles.splice(idx, 1);
      }

      // Add or remove other shipRoles
      if (!memberForm.wsShipRoles.some(el => el === shipRole)) {
        memberForm.wsShipRoles.push(shipRole);
      } else {
        const idx = memberForm.wsShipRoles.indexOf(shipRole);
        if (idx !== -1) {
          memberForm.wsShipRoles.splice(idx, 1);
        }
      }
    }

    if (memberForm.wsShipRoles.length === 5) {
      memberForm.wsShipRoles = ['A']
    }
  }

  function formVerify() {
    if (memberForm.rsLevel > 11) {
      memberForm.rsLevel = 11
    }
    if (memberForm.rsLevel < 0) {
      memberForm.rsLevel = 0
    }
    if (memberForm.bsLevel > 6) {
      memberForm.bsLevel = 6
    }
    if (memberForm.bsLevel < 1) {
      memberForm.bsLevel = 1
    }
  }

  async function submit() {
    if (sendRequest.value) return;

    sendRequest.value = true
    const { data, error, pending } = await useFetch(
      `${config.apiBaseUrl}/members/${props.member.id}/`,
        {
          method: 'PATCH',
          body: memberForm,
          headers: [
            ['Corporation-Secret', getCorporationSecret(props.corporationId)]
          ],  
        }
      )
      
    if (data.value) {
      toast.success('Member data updated successfully.');
      updateCorporationMember({...data.value});
      emit('successEditMember');
    }
    
    if (error.value) {
      toast.error(`${error.value.response.status} - ${error.value.data.detail}`)
    }
    
    sendRequest.value = pending.value
  }
</script>


<template>
  <div>
    <UiHeaderH2>Edit form</UiHeaderH2>
    <UiDivider />
    <div class="text-gray-200">
      <UiInputText 
        v-model="memberForm.name"
        :name="'memberName'"
        :value="memberForm.name"
        :label="'Member Nickname'"
      />
      <UiSelect
        v-model="memberForm.timeZone"
        :values="commonTimezones"
        :selected="memberForm.timeZone"
        :label="'Timezone'"
      />
      <div
        class="mt-2 grid grid-cols-2 gap-4"
      >
        <div>
          <UiLabel :text="'Red Star Level'"/>
          <div class="flex">
            <div>
              <UiInputText 
              v-model="memberForm.rsLevel"
              :value="memberForm.rsLevel"
              :name="'rsLevel'"
              :cssClasses="'w-12 text-center'"
              @change="formVerify()"
              />
            </div>
            <div class="mx-2">
              <font-awesome-icon
                icon="fa-duotone fa-square-minus"
                class="text-4xl mt-0.5 cursor-pointer"
                @click="memberForm.rsLevel--; formVerify()"
              />
            </div>
            <div>
              <font-awesome-icon
                icon="fa-duotone fa-square-plus"
                class="text-4xl mt-0.5 cursor-pointer"
                @click="memberForm.rsLevel++; formVerify()"
              />
            </div>
          </div>
        </div>
        <div>
          <UiLabel 
            :text="'Willing to be a Leader'"
          />
          <UiButton 
            :size="'sm'"
            :text="'Yes'"
            :layout="memberForm.asLeader ? '' : 'transparent'"
            class="mr-2"
            @click="memberForm.asLeader = true"
          />
          <UiButton 
            :size="'sm'"
            :text="'No'"
            :layout="!memberForm.asLeader ? '' : 'transparent'"
            class="mr-2"
            @click="memberForm.asLeader = false"
          />
        </div>
        <div>
          <UiLabel :text="'Battleship Level'"/>
          <div class="flex">
            <div>
              <UiInputText 
              v-model="memberForm.bsLevel"
              :value="memberForm.bsLevel"
              :name="'rsLevel'"
              :cssClasses="'w-12 text-center'"
              @change="formVerify()"
              />
            </div>
            <div class="mx-2">
              <font-awesome-icon
                icon="fa-duotone fa-square-minus"
                class="text-4xl mt-0.5 cursor-pointer"
                @click="memberForm.bsLevel--; formVerify()"
              />
            </div>
            <div>
              <font-awesome-icon
                icon="fa-duotone fa-square-plus"
                class="text-4xl mt-0.5 cursor-pointer"
                @click="memberForm.bsLevel++; formVerify()"
              />
            </div>
          </div>
        </div>
        <div>
          <UiLabel 
            :text="'WS Ship role'"
          />
          <UiButton
            v-for="wsShipRole in wsShipRoles"
            :size="'sm'"
            :text="wsShipRole.code"
            :layout="wsShipRoleButtonLayout(wsShipRole.code)"
            v-tooltip="{content: wsShipRole.name}"
            class="mr-2 mb-2"
            @click="wsShipRoleAddOrRemove(wsShipRole.code)"
          />
        </div>
        <div class="col-span-2 pb-4">
          <nuxt-img
            :src="`/images/bs-${bsLevel()}.png`"
            loading="lazy"
            class="h-24 mx-auto"
          />
          <div class="text-center mt-4">
            <MembersWsShipRoles 
              :shipRoles="memberForm.wsShipRoles"
            />
          </div>
        </div>
      </div>
    </div>
    <UiDivider />
    <UiButton
      :text="'Save data'"
      :layout="'transparent'"
      :size="'sm'"
      class="mr-2"
      @click="submit()"
    />
    <UiButton
      :text="'Cancel'"
      :layout="'transparent'"
      :size="'sm'"
      @click="emit('cancelEditMember')"
    />
  </div>
</template>