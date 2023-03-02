<script setup lang="ts">
  import { ShipAttribute, Attribute } from "@/types/ship-attribute";
  import { useToast } from "vue-toastification";
  type filterAttributeType = Attribute & {
    type: String
  }


  const config = useRuntimeConfig();
  const toast = useToast();
  const { getMemberShipAttributes } = useShipAttributes();
  const { getCorporationSecret } = useCorporationDetails();

  const props = defineProps({
    corporationId: {
      type: String,
      required: true,
    },
  });
  const emit = defineEmits(['closePopup'])

  const formStep = ref(1)
  const formProgress = ref<number>(0)
  const submitAllowed = ref<boolean>(false)

  const selectedAttributesId = ref<String[]>([]);
  const selectedAttributes = ref<filterAttributeType[]>([]);

  const filterForm = reactive({
    name: '',
    corporationId: props.corporationId
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

    }
    formStep.value = 2;
  }

  function setAttributeValue(attribute: filterAttributeType, value: number) {
    if (attribute.current + value >= 0 && attribute.current + value <= attribute.max) {
        attribute.current += value;
        if (attribute.current === attribute.max) {
          toast.info(`${attribute.current} is maximum for ${attribute.name}`);
        }
      } else if (attribute.current + value < 0) {
        attribute.current = 0;
      }
      setFormProgress()
  }
  function setAttributeValueType(attribute: filterAttributeType, type: string) {
    attribute.type = type;
  }

  function setFormProgress():void {
    let progress = 0;
    if (filterForm.name.trim().length > 0) {
      progress += 25
    }
    if (selectedAttributesId.value.length > 0) {
      progress += 25
    }
    if (selectedAttributes.value.length > 0) {
      const progressLeft = 100 - progress
      const attributesWitoutZero = selectedAttributes.value.filter((attribute) => {
        return attribute.current !== 0
      })
      const progressToAdd = (attributesWitoutZero.length * 100) / selectedAttributes.value.length
      progress += (progressToAdd / 2)
    }
    formProgress.value = progress
    submitAllowed.value = formProgress.value === 100 ? true : false;
  }

  async function saveForm() {
    if (!submitAllowed.value) {
      toast.error("Please fill all values in selected attributes")
      return
    }

    const { data, error } = await useFetch(
      `${config.apiBaseUrl}/corporations/add-filter/`,
      {
        method: 'POST',
        body: {...filterForm, selectedAttributes: selectedAttributes.value},
        headers: [
          ['Corporation-Secret', getCorporationSecret(props.corporationId)]
        ]
      }
    )

    if (data.value) {
      toast.success('Filter added successfully.');
    }
    if (error.value && error.value.response) {
      toast.error(`${error.value.response.status} - ${error.value.data.detail}`)
    }
    
  }

</script>

<template>
  <div>
    <form @submit.prevent="saveForm" :corporation-id="corporationId">
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

      <UiDivider />
      <UiInputText
        v-model="filterForm.name"
        :value="filterForm.name"
        :name="'filterName'"
        :label="'Filter name'"
        :css-classes="'w-full lg:w-96'"
        @input="setFormProgress"
      />
      <div
        v-if="attributes && formStep === 1"
      >
        <UiHeaderH2>Step 1</UiHeaderH2>
        <UiParagraph>Choose ship attributes you want to filter. {{ selectedAttributesId.length }}</UiParagraph>
        <div>
          <UiHeaderH2>Weapons</UiHeaderH2>
          <UiCard
            :layout="'dark'"
          >
            <UiButton
              v-for="attribute in attributes.weapon"
              class="mr-2 mb-2"
              :text="attribute.id"
              :layout="selectedAttributesId.includes(attribute.id) ? '' : 'transparent'"
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
              :layout="selectedAttributesId.includes(attribute.id) ? '' : 'transparent'"
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
              :layout="selectedAttributesId.includes(attribute.id) ? '' : 'transparent'"
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
            :layout="selectedAttributesId.includes(attribute.id) ? '' : 'transparent'"
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
              :layout="selectedAttributesId.includes(attribute.id) ? '' : 'transparent'"
              @click="toggleAttribute(attribute)"
            />
          </UiCard>
        </div>

        <UiButton
          class="mr-2 mb-2"
          :text="'Next'"
          :disabled="selectedAttributesId.length === 0 && filterForm.name === '' ? true : false"
          @click="goToStep2()"
        />
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
                    <UiHeaderH1 :class="'mt-4 mx-4'">{{  attribute.current }}</UiHeaderH1>
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
        

        <UiDivider class="mt-8"/>
        <UiButton
          class="mr-2 mb-2"
          :text="'Prev'"
          @click="formStep = 1; selectedAttributes = []; setFormProgress()"
        />
        <UiButton
          class="mr-2 mb-2"
          :text="'Save'"
          @click="saveForm"
        />
      </div>
    </form>
  </div>
</template>