<script setup lang="ts">
  import { ShipAttribute } from "@/types/ship-attribute";

  const config = useRuntimeConfig();
  const { getMemberShipAttributes } = useShipAttributes();

  const props = defineProps({
    corporationId: {
      type: String,
      required: true,
    },
  });
  const emit = defineEmits(['closePopup'])

  const filterForm = reactive({
    name: '',
    corporationId: props.corporationId,
  });

  const { data: attributes } = await useFetch<ShipAttribute>(`${config.apiBaseUrl}/utils/ship-attributes/`);


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
      />
      <div
        v-if="attributes"
        class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-1"
      >
        <div>
          <UiHeaderH2>Weapons</UiHeaderH2>
          <UiCard
            :layout="'dark'"
          >
            <ul>
              <li
                v-for="attribute in attributes.weapon"
                class="my-1 flex items-center"
              >
                <UiBadge :text="`${attribute.max}`" /> {{ attribute.name }}
              </li>
            </ul>            
          </UiCard>
        </div>
        <div>
          <UiHeaderH2>Shields</UiHeaderH2>
          <UiCard
            :layout="'dark'"
          >
            <ul>
              <li v-for="attribute in attributes.shield">{{ attribute.name }}</li>
            </ul>
          </UiCard>
        </div>
        <div>
          <UiHeaderH2>Support</UiHeaderH2>
          <UiCard
            :layout="'dark'"
          >
            <ul>
              <li v-for="attribute in attributes.support">{{ attribute.name }}</li>
            </ul>
          </UiCard>
        </div>
        <div>
          <UiHeaderH2>Mining</UiHeaderH2>
          <UiCard
            :layout="'dark'"
          >
            <ul>
              <li v-for="attribute in attributes.mining">{{ attribute.name }}</li>
            </ul>
          </UiCard>
        </div>
        <div>
          <UiHeaderH2>Trade</UiHeaderH2>
          <UiCard
            :layout="'dark'"
          >
            <ul>
              <li v-for="attribute in attributes.trade">{{ attribute.name }}</li>
            </ul>
          </UiCard>
        </div>
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