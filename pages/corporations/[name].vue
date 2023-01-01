<script setup lang="ts">
  import corporationData from '~/data/corporationDetail.json';
  import { CorporationDetails } from '~/types/corporation';

  const corporation = ref<CorporationDetails | null>(corporationData)

</script>

<template>
  <div>
    <div v-if="corporation">
      <UiHeaderH1>
        <font-awesome-icon
          icon="fa-duotone fa-square-arrow-left"
          class="text-3xl"
          @click="navigateTo('/corporations')"
        />
        {{ corporation.name }} details
      </UiHeaderH1>
    </div>
    <div v-else``>
      <UiHeaderH1>404</UiHeaderH1>
      <UiParagraph>Sorry Corporation not found</UiParagraph>
      <UiButton
        :text="'Go back'"
        @click="navigateTo('/corporations')"
      />
    </div>
  </div>
</template>