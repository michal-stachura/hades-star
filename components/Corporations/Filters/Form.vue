<script setup lang="ts">
  import { PropType, computed, Ref } from 'vue';
  import { useToast } from "vue-toastification";
  import { ShipAttribute, Attribute } from "@/types/ship-attribute";
  import { Filter } from '@/types/filter';
  type filterAttributeType = Attribute & {
    type: String
  }

  const props = defineProps({
    filter: {
      type: Object as PropType<Filter>,
      required: false,
      default: undefined
    }
  })

  const config = useRuntimeConfig();
  const toast = useToast();
  const emit = defineEmits(['cancelForm']);
  const { corporation, getCorporationSecret, addCorporationFilter, updateCorporationFilter } = useCorporationDetails();

  const formStep = ref(1)
  const formProgress = ref<number>(0)
  const submitAllowed = ref<boolean>(false)

  const selectedAttributesId = ref<string[]>([])
  const selectedAttributes = ref<filterAttributeType[]>([]);
  if (props.filter?.conditions) {
    selectedAttributesId.value = props.filter.conditions.map(condition => condition.id)
    selectedAttributes.value = props.filter.conditions
  }
  
  const clickedtAttributeGroup = ref<'weapon' | 'shield' | 'support' | 'mining' | 'trade'>('weapon');
  
  const filterForm = reactive({
    filterId: props.filter?.id ?? undefined,
    name: props.filter?.name ?? '',
  });


  const { data: attributes } = await useFetch<ShipAttribute>(`${config.apiBaseUrl}/utils/ship-attributes/`);

  function toggleAttribute(attribute: Attribute) {
    if (selectedAttributesId.value.includes(attribute.id)) {
      selectedAttributesId.value.splice(selectedAttributesId.value.indexOf(attribute.id), 1)
    } else {
      selectedAttributesId.value.push(attribute.id)
    }
    setFormProgress()
  }


  function goToStep2(){
    if (attributes.value) {
      const weapons = attributes.value.weapon?.filter(attribute => selectedAttributesId.value.includes(attribute.id)) ?? [];
      const support = attributes.value.support?.filter(attribute => selectedAttributesId.value.includes(attribute.id)) ?? [];
      const shields = attributes.value.shield?.filter(attribute => selectedAttributesId.value.includes(attribute.id)) ?? [];
      const mining = attributes.value.mining?.filter(attribute => selectedAttributesId.value.includes(attribute.id)) ?? [];
      const trade = attributes.value.trade?.filter(attribute => selectedAttributesId.value.includes(attribute.id)) ?? [];
      
      selectedAttributes.value = [...weapons,  ...support, ...shields, ...mining, ...trade].map(attribute => {
        return {...attribute, type: 'equal'}
      });
      // TODO: fix selectedAttributes which are override by default value and `set` parameter is equeal to 0 on step 2 !!!
      console.log(selectedAttributes.value)
    }
    formStep.value = 2;
  }

  function setAttributeValue(attribute: filterAttributeType, value: number) {
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
  function setAttributeValueType(attribute: filterAttributeType, type: string) {
    attribute.type = type;
  }

  function setFormProgress():void {
    let progress = 0;
    if (filterForm.name && filterForm.name.trim().length > 0) {
      progress += 25
    }
    if (selectedAttributesId.value.length > 0) {
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
            <UiLabel :text="`Chosen criteria. ${ selectedAttributesId.length }`" />
            <UiBadge 
              v-for="filterId in selectedAttributesId"
              :text="`${filterId}`" 
            />
          </div>
        </div>

        <div class="mt-8 mb-2">
          <UiParagraph>
            Choose category and select attributes you want to add to filter.
          </UiParagraph>
          <UiButton
            :text="'Weapon'"
            :size="'sm'"
            :layout="clickedtAttributeGroup === 'weapon' ? '' : 'transparent'"
            class="mr-1"
            @click="clickedtAttributeGroup = 'weapon'"
            />
          <UiButton
            :text="'Sheilds'"
            :size="'sm'"
            :layout="clickedtAttributeGroup === 'shield' ? '' : 'transparent'"
            class="mr-1"
            @click="clickedtAttributeGroup = 'shield'"
          />
          <UiButton
            :text="'Support'"
            :size="'sm'"
            :layout="clickedtAttributeGroup === 'support' ? '' : 'transparent'"
            class="mr-1"
            @click="clickedtAttributeGroup = 'support'"
          />
          <UiButton
            :text="'Mining'"
            :size="'sm'"
            :layout="clickedtAttributeGroup === 'mining' ? '' : 'transparent'"
            class="mr-1"
            @click="clickedtAttributeGroup = 'mining'"
          />
          <UiButton
            :text="'Trade'"
            :size="'sm'"
            :layout="clickedtAttributeGroup === 'trade' ? '' : 'transparent'"
            class="mr-1"
            @click="clickedtAttributeGroup = 'trade'"
          />
        </div>
        <div
          v-if="clickedtAttributeGroup === 'weapon'"
          class="mt-4"
        >
          <CorporationsFiltersAttributeButton
            v-for="attribute in attributes.weapon"
            class="mr-1 mb-1"
            :text="attribute.id"
            :layout="selectedAttributesId.includes(attribute.id) ? '' : 'transparent'"
            :size="'sm'"
            :icon="`${config.imagesUrl}/images/${$slugify(attribute.id)}.png`"
            @click="toggleAttribute(attribute)"
          />
        </div>
        <div
          v-if="clickedtAttributeGroup === 'shield'"
        >
          <CorporationsFiltersAttributeButton
            v-for="attribute in attributes.shield"
            class="mr-1"
            :text="attribute.id"
            :layout="selectedAttributesId.includes(attribute.id) ? '' : 'transparent'"
            :size="'sm'"
            :icon="`${config.imagesUrl}/images/${$slugify(attribute.id)}.png`"
            @click="toggleAttribute(attribute)"
          />
        </div>
        <div
          v-if="clickedtAttributeGroup === 'support'"
        >
          <CorporationsFiltersAttributeButton
            v-for="attribute in attributes.support"
            class="mr-1 mb-1"
            :text="attribute.id"
            :size="'sm'"
            :layout="selectedAttributesId.includes(attribute.id) ? '' : 'transparent'"
            :icon="`${config.imagesUrl}/images/${$slugify(attribute.id)}.png`"
            @click="toggleAttribute(attribute)"
          />
        </div>
        <div
          v-if="clickedtAttributeGroup === 'mining'"
        >
          <CorporationsFiltersAttributeButton
            v-for="attribute in attributes.mining"
            class="mr-1 mb-1"
            :text="attribute.id"
            :layout="selectedAttributesId.includes(attribute.id) ? '' : 'transparent'"
            :size="'sm'"
            :icon="`${config.imagesUrl}/images/${$slugify(attribute.id)}.png`"
            @click="toggleAttribute(attribute)"
          />
        </div>
        <div
          v-if="clickedtAttributeGroup === 'trade'"
        >
          <CorporationsFiltersAttributeButton
            v-for="attribute in attributes.trade"
            class="mr-1 mb-1"
            :text="attribute.id"
            :layout="selectedAttributesId.includes(attribute.id) ? '' : 'transparent'"
            :size="'sm'"
            :icon="`${config.imagesUrl}/images/${$slugify(attribute.id)}.png`"
            @click="toggleAttribute(attribute)"
          />
        </div>
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
                    <UiHeaderH1 :class="'mt-4 mx-4'">{{ attribute.set }}</UiHeaderH1>
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
                :class="'mr-2'"
                @click="setAttributeValueType(attribute, 'equal')"
              />
              <UiButton
                :text="'lower or equal'"
                :size="'sm'"
                :layout="attribute.type === 'lower' ? '': 'transparent'"
                :class="'mr-2'"
                @click="setAttributeValueType(attribute, 'lower')"
              />
              <UiButton
                :text="'bigger or equal'"
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
        v-if="formStep === 2"
        class="mr-1"
        :text="'Prev'"
        :size="'sm'"
        :layout="'transparent'"
        @click="formStep = 1; selectedAttributes = []; setFormProgress()"
        />
        <UiButton
        class="mr-1"
        :text="'Cancel'"
        :size="'sm'"
        :layout="'transparent'"
        @click="emit('cancelForm')"
        />
        <UiButton
          v-if="formStep === 1"
          :text="'Next'"
          :size="'sm'"
          :layout="'transparent'"
          :disabled="formProgress < 50 ? true : false"
          @click="goToStep2()"
        />
        <UiButton
          v-if="formStep === 2"
          class="mr-1"
          :text="'Save'"
          :size="'sm'"
          :layout="'transparent'"
          @click="saveForm"
        />
    </template>
  </UiCard>
</template>