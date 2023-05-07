<script setup lang="ts">
  import { PropType } from 'vue';
  import { useToast } from "vue-toastification";
  import { ShipAttribute, Attribute } from "@/types/ship-attribute";
  import { Filter } from '@/types/filter';

  const props = defineProps({
    filter: {
      type: Object as PropType<Filter>,
      required: false,
      default: undefined
    },
    editForm: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  const config = useRuntimeConfig();
  const toast = useToast();
  const emit = defineEmits(['cancelForm']);
  const { corporation, getCorporationSecret, addCorporationFilter, updateCorporationFilter } = useCorporationDetails();

  const formStep = ref(1)
  const formProgress = ref<number>(0)
  const submitAllowed = ref<boolean>(false)

  const selectedAttributes = ref<Attribute[]>([]);
  if (props.filter?.conditions) {
    selectedAttributes.value = props.filter.conditions
  }
  
  const clickedtAttributeGroup = ref<'Weapon' | 'Shield' | 'Support' | 'Mining' | 'Trade'>('Weapon');
  const attributeGroups: Array<typeof clickedtAttributeGroup.value> = ['Weapon', 'Shield', 'Support', 'Mining', 'Trade'];
  
  const filterForm = reactive({
    filterId: props.filter?.id ?? undefined,
    name: props.filter?.name || '',
  });


  const { data: attributes } = await useFetch<ShipAttribute>(`${config.apiBaseUrl}/utils/ship-attributes/`);
  

  function toggleAttribute(attribute: Attribute) {
    const idx = selectedAttributes.value.findIndex(attr => attr.id == attribute.id)
    if (idx !== -1) {
      selectedAttributes.value.splice(idx, 1)
    } else {
      attribute['type'] = 'equal';
      selectedAttributes.value.push(attribute);
    }
    setFormProgress()
  }

  function setAttributeValue(attribute: Attribute, value: number) {
    if (attribute.set + value >= 0 && attribute.set + value <= attribute.max) {
        attribute.set += value;
        if (attribute.set === attribute.max) {
          toast.info(`${attribute.set} is maximum for ${attribute.name}`);
        }
      } else if (attribute.set + value < 0) {
        attribute.set = 0;
      }
      setFormProgress()
  }
  function setAttributeValueType(attribute: Attribute, type: string) {
    attribute.type = type;
  }

  function setFormProgress():void {
    let progress = 0;
    if (filterForm.name && filterForm.name.trim().length > 0) {
      progress += 25
    }
    if (selectedAttributes.value.length > 0) {
      progress += 25
    }
    if (selectedAttributes.value.length > 0) {
      const attributesWitoutZero = selectedAttributes.value.filter((attribute) => {
        return attribute.set !== 0
      })
      const progressToAdd = (attributesWitoutZero.length * 100) / selectedAttributes.value.length
      progress += (progressToAdd / 2)
    }
    formProgress.value = progress
    submitAllowed.value = formProgress.value === 100 ? true : false;
  }

  async function saveForm() {
    if (!submitAllowed.value) {
      toast.error("Please fill all values in selected attributes");
    }

    if (corporation.value) {
      const method = props.filter ? 'PATCH' : 'POST';
      const url = props.filter ? `${config.apiBaseUrl}/corporations/${corporation.value.id}/edit-filter/` : `${config.apiBaseUrl}/corporations/${corporation.value.id}/add-filter/`

      const { data, error } = await useFetch(
        url,
        {
          method: method,
          body: {...filterForm, conditions: selectedAttributes.value},
          headers: [
            ['Corporation-Secret', getCorporationSecret(corporation.value.id)]
          ]
        }
      )
      
      if (data.value) {
        toast.success('Filter added successfully.');
        formStep.value = 1;
        if (method === 'POST') {
          addCorporationFilter(data.value as Filter);
        } else if (method === 'PATCH') {
          updateCorporationFilter(data.value as Filter);
        }
        emit('cancelForm');
      }
      if (error.value && error.value.response) {
        toast.error(`${error.value.response.status} - ${error.value.data.detail}`)
      }
    }
  }

  function isSelectedAttribute (attribute: Attribute): boolean {
    return selectedAttributes.value.some(selectedItem => selectedItem.id === attribute.id);
  }

  setFormProgress();
</script>

<template>
  <UiCard
    v-if="corporation"
    :footer="true"
    :header="true"
  > 
  <template #header>
    <div class="flex">
      <div class="grow">
        <UiHeaderH1>Filter form</UiHeaderH1>
        <UiParagraph>Welcome Commander.</UiParagraph>
          <UiParagraph>
            Here you can define or edit filter which will be helpful in your WhiteStar Campaigns.<br />All filters will be availiable to use by the rest of your Corporation members
          </UiParagraph>
      </div>
      <div class="grow-0">
        <UiCircleProgress
          v-if="!editForm"
          :progress="formProgress"
          :animation-duration="300"
          :progress-thickness="5"
          :progress-color="'text-gray-500'"
        />
      </div>
    </div>
  </template>

    <form @submit.prevent="saveForm" :corporation-id="corporation.id">
      <div
        v-if="attributes && formStep === 1"
      >
        <UiHeaderH2>Step 1 of 2</UiHeaderH2>
        <div class="grid grid-cols-2">
          <div>
            <UiInputText
              v-model="filterForm.name"
              v-focus
              :value="filterForm.name"
              :placeholder="'My awesome filter...'"
              :name="'filterName'"
              :label="'Filter name'"
              :css-classes="'w-full lg:w-96'"
              @input="setFormProgress"
            />
          </div>
          <div>
            <UiLabel :text="`Chosen criteria. ${ selectedAttributes.length }`" />
            <UiBadge 
              v-for="filter in selectedAttributes"
              :text="`${filter.id}`" 
            />
          </div>
        </div>

        <div class="mt-8 mb-2">
          <UiParagraph>
            Choose category and select attributes you want to add to filter.
          </UiParagraph>
          <UiButton
            v-for="attributeGroup in attributeGroups"
            :text="attributeGroup"
            :size="'sm'"
            :layout="clickedtAttributeGroup === attributeGroup ? '' : 'transparent'"
            class="mr-1"
            @click="clickedtAttributeGroup = attributeGroup"
          />
        </div>
        <template
          v-for="attributeGroup in Object.keys(attributes)"
        >
          <div
            v-if="clickedtAttributeGroup === attributeGroup"
            class="mt-4"
          >
            <CorporationsFiltersAttributeButton
              v-for="attribute in attributes[attributeGroup]"
              class="mr-1 mb-1"
              :text="attribute.id"
              :layout="isSelectedAttribute(attribute) ? '' : 'transparent'"
              :size="'sm'"
              :icon="`${config.imagesUrl}/images/${$slugify(attribute.id)}.png`"
              @click="toggleAttribute(attribute)"
            />
          </div>
        </template>
      </div>
      <div
        v-if="attributes && formStep === 2"
      >
        <UiHeaderH2>Step 2</UiHeaderH2>
        <UiParagraph>Set values for selected attributes and save your Filter</UiParagraph>
        <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          <div
            v-for="attribute in selectedAttributes"
          >
            <UiCard
              :layout="'dark'"
              :class="'text-center'"
            >
              <UiHeaderH2>{{ attribute.name }}</UiHeaderH2>
              <div class="grid grid-cols-3 justify-items-center">
                <div class="flex items-center">
                  <UiButton
                    :text="'-'"
                    :layout="'transparent'"
                    @click="setAttributeValue(attribute, -1)"
                  />
                </div>
                <div>
                  <UiCard
                    :class="'rounded-full w-20 h-20 flex items-center justify-center'"
                  >
                    <UiHeaderH1>{{ attribute.set }}</UiHeaderH1>
                  </UiCard>
                </div>
                <div class="flex items-center">
                  <UiButton
                    :text="'+'"
                    :layout="'transparent'"
                    @click="setAttributeValue(attribute, 1)"
                  />
                </div>
              </div>
              <UiDivider class="mt-4"/>
              <UiButton
                :text="'equal'"
                :size="'sm'"
                :layout="attribute.type === 'equal' ? '': 'transparent'"
                :class="'mr-2 mb-1'"
                @click="setAttributeValueType(attribute, 'equal')"
              />
              <UiButton
                :text="'lower or equal'"
                :size="'sm'"
                :layout="attribute.type === 'lower' ? '': 'transparent'"
                :class="'mr-2 mb-1'"
                @click="setAttributeValueType(attribute, 'lower')"
              />
              <UiButton
                :text="'greater or equal'"
                :size="'sm'"
                :layout="attribute.type === 'bigger' ? '': 'transparent'"
                @click="setAttributeValueType(attribute, 'bigger')"
              />
            </UiCard>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <UiButton
        class="mr-1"
        :text="'Cancel'"
        :size="'sm'"
        :layout="'transparent'"
        @click="emit('cancelForm')"
      />
      <UiButton
        class="mr-1"
        :text="'Prev'"
        :size="'sm'"
        :layout="'transparent'"
        :disabled="formStep === 1"
        @click="formStep = 1"
      />
      <UiButton
        class="mr-1"
        :text="'Next'"
        :size="'sm'"
        :layout="'transparent'"
        :disabled="formStep === 2 || formProgress < 50"
        @click="formStep = 2"
      />
      <UiButton
        class="float-right"
        :text="'Save'"
        :size="'sm'"
        :layout="'transparent'"
        :disabled="formProgress !== 100"
        @click="saveForm"
      />
    </template>
  </UiCard>
</template>