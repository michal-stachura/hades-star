<script setup lang="ts">
import { useToast } from 'vue-toastification';

  const props = defineProps({
    corporationId: {
      type: String,
      required: true,
    }
  })
  const emit = defineEmits(['sucessAddMember', 'cancelAddMember']);

  const memberForm = reactive({
    name: '',
    corporation: [props.corporationId],
  });
  const { getCorporationSecret, addCorporationMember } = useCorporationDetails();

  const config = useRuntimeConfig();
  const toast = useToast();
  const sendRequest = ref(false);

  function formVerify() {
    if (memberForm.name === '' || !memberForm.name) {
      return false
    };
    return true;
  }

  async function submit() {
    if (sendRequest.value) return;
    sendRequest.value = true;

    if (!formVerify()) {
      toast.error('Please provide new member name.')
      sendRequest.value = false;
    } else {
      const { data, error, pending } = await useFetch(
        `${config.apiBaseUrl}/members/`,
        {
          method: 'POST',
          body: memberForm,
          headers: [
            ['Corporation-Secret', getCorporationSecret(props.corporationId)]
          ], 
        }
      )

      if (data.value) {
        toast.success('Member added successfully.');
        emit('sucessAddMember');
        addCorporationMember({...data.value});
      }
      if (error.value) {
        toast.error(`${error.value.response.status} - ${error.value.data.detail}`)
      }
      sendRequest.value = pending.value;
    }




  }
</script>

<template>
  <div class="p-4">
    <UiHeaderH2>
      Add new member
    </UiHeaderH2>
    <UiInputText 
      v-model="memberForm.name"
      :label="'Member name'"
      :value="memberForm.name"
      :name="'memberName'"
      class="mb-5"
    />
    <UiDivider />
    <UiButton
      :layout="'transparent'"
      :size="'sm'"
      :text="'Add member'"
      class="mr-2"
      @click="submit()"
    />
    <UiButton
      :layout="'transparent'"
      :size="'sm'"
      :text="'Cancel'"
      @click="emit('cancelAddMember')"
    />
  </div>
</template>