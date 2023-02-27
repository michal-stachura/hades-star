<script setup lang="ts">
  import { ShipAttribute, Attribute } from "@/types/ship-attribute";

  const config = useRuntimeConfig();
  const { getMemberShipAttributes } = useShipAttributes();

  const props = defineProps({
    corporationId: {
      type: String,
      required: true,
    },
  });
  const emit = defineEmits(['closePopup', 'setFilterName'])

  const formStep = ref(1)
  const selectedAttributes = ref<String[]>([])

  const filterForm = reactive({
    name: '',
    corporationId: props.corporationId,
  });


  const { data: attributes } = await useFetch<ShipAttribute>(`${config.apiBaseUrl}/utils/ship-attributes/`);

  function toggleAttribute(attribute: Attribute) {
    if (selectedAttributes.value.includes(attribute.id)) {
      selectedAttributes.value.splice(selectedAttributes.value.indexOf(attribute.id), 1)
    } else {
      selectedAttributes.value.push(attribute.id)
    }
  }


  function saveForm() {
    console.log('Saving form...');
  }

</script>

<template>
  <div>
    <form @submit.prevent="saveForm" :corporation-id="corporationId">
      <UiInputText
        v-model="filterForm.name"
        :value="filterForm.name"
        :name="'filterName'"
        :label="'Filter name'"
        :css-classes="'w-full lg:w-96'"
        @input="emit('setFilterName', filterForm.name)"
      />
      <div
        v-if="attributes && formStep === 1"
      >
        <UiHeaderH2>Step 1</UiHeaderH2>
        <UiParagraph>Choose ship attributes you want to filter. {{ selectedAttributes.length }}</UiParagraph>
        <div>
          <UiHeaderH2>Weapons</UiHeaderH2>
          <UiCard
            :layout="'dark'"
          >
            <UiButton
              v-for="attribute in attributes.weapon"
              class="mr-2 mb-2"
              :text="attribute.id"
              :layout="selectedAttributes.includes(attribute.id) ? '' : 'transparent'"
              :type="'button'"
              @click="toggleAttribute(attribute)"
            />
          </UiCard>
        </div>
        <div>
          <UiHeaderH2>Shields</UiHeaderH2>
          <UiCard
            :layout="'dark'"
          >
            <UiButton
              v-for="attribute in attributes.shield"
              class="mr-2 mb-2"
              :text="attribute.id"
              :layout="selectedAttributes.includes(attribute.id) ? '' : 'transparent'"
              @click="toggleAttribute(attribute)"
            />
          </UiCard>
        </div>
        <div>
          <UiHeaderH2>Support</UiHeaderH2>
          <UiCard
            :layout="'dark'"
          >
            <UiButton
              v-for="attribute in attributes.support"
              class="mr-2 mb-2"
              :text="attribute.id"
              :layout="selectedAttributes.includes(attribute.id) ? '' : 'transparent'"
              @click="toggleAttribute(attribute)"
            />
          </UiCard>
        </div>
        <div>
          <UiHeaderH2>Mining</UiHeaderH2>
          <UiCard
            :layout="'dark'"
          >
          <UiButton
            v-for="attribute in attributes.mining"
            class="mr-2 mb-2"
            :text="attribute.id"
            :layout="selectedAttributes.includes(attribute.id) ? '' : 'transparent'"
            @click="toggleAttribute(attribute)"
          />
          </UiCard>
        </div>
        <div>
          <UiHeaderH2>Trade</UiHeaderH2>
          <UiCard
            :layout="'dark'"
          >
            <UiButton
              v-for="attribute in attributes.trade"
              class="mr-2 mb-2"
              :text="attribute.id"
              :layout="selectedAttributes.includes(attribute.id) ? '' : 'transparent'"
              @click="toggleAttribute(attribute)"
            />
          </UiCard>
        </div>
      </div>
      <div
        v-if="attributes && formStep === 2"
      >
        <UiHeaderH2>Step 2</UiHeaderH2>
      </div>
      <UiCard :layout="'dark'">
          <pre class="text-sm">{{attributes}}</pre>
      </UiCard>
    </form>
    <UiDivider />

    <UiButton
      :text="'Cancel'"
      :layout="'transparent'"
      :size="'sm'"
      @click="emit('closePopup')"
    />
  </div>
</template>