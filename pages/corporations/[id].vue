<script setup lang="ts">
  import corporationData from '@/data/corporationDetail.json';
  const { corporation, wsReady, getWsReady } = useCorporationDetails();
  corporation.value = corporationData;
  getWsReady()
</script>

<template>
  <div>
    <div v-if="corporation">
      <UiHeaderH1
        :nav-back="'/corporations'"
      >
        {{ corporation.name }} details
      </UiHeaderH1>
      <UiDivider />
      <div class="text-white">
        WS ready: {{ wsReady }}
      </div>
      <div class="flex">
        <div class="max-w-fit">
          <UiHeaderH2>
            Username
          </UiHeaderH2>
          <UiCard
            v-for="member in corporation.members"
            :key="member.id"
          >
            {{ member.username }}
          </UiCard>
        </div>
        <div class="ml-2">
          <UiHeaderH2>
            Next scan
          </UiHeaderH2>
          <CorporationsNextWs 
            v-for="member in corporation.members"
            :member="member"
            :key="member.id"
          />
        </div>
      </div>
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