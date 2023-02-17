<script setup lang="ts">
  import { PropType } from 'vue';
  import { CorporationDetails } from '@/types/corporation';
  
  
  const props = defineProps({
    corporation: {
      required: true,
      type: Object as PropType<CorporationDetails>,
    }
  });
  const { $clipboard } = useNuxtApp();
  const route = useRoute();

  
  
  const urlCopied = ref(false);
  const discordCopied = ref(false);

  function copyHeadquatersUrl() {
    if (process.client) {  
      $clipboard(window.location.href)
      urlCopied.value = true;
      setTimeout(() => {
        urlCopied.value = false;
      }, 2000)
    }
  }
  function copyDiscordUrl() {
    $clipboard(props.corporation.discord)
    discordCopied.value = true;
    setTimeout(() => {
      discordCopied.value = false;
    }, 2000)
  }
</script>

<template>
  <div>
    <UiCard>
      <div>
        <UiLabel 
          :text="'Headquater ID'"
        />
        {{ corporation.id }}
        <div>
          <UiButton
            :text="'Copy Headquater website'"
            :layout="'transparent'"
            :size="'sm'"
            @click="copyHeadquatersUrl"
          />
          <UiBadge
            v-if="urlCopied"
            :text="'Copied'"
            class="float-right mr-0 mt-1"
          />
        </div>
      </div>
      <div class="mt-2 mb-4">
        <span v-if="corporation.discord">
          <UiLabel
          :text="'Discord'"
          />
          {{ corporation.discord }}
          <div>
            <UiButton
              :text="'Copy Discord URL'"
              :layout="'transparent'"
              :size="'sm'"
              @click="copyDiscordUrl"
            />
            <UiBadge
              v-if="discordCopied"
              :text="'Copied'"
              class="float-right mr-0 mt-1"
            />
          </div>
        </span>
      </div>
      <UiDivider />
      <div class="grid grid-cols-2 gap-4">
        <div>
          <UiLabel :text="'Corporation Level'" />
          <UiHeaderH1>{{ corporation.level }}</UiHeaderH1>
        </div>
        <div>
          <UiLabel :text="'Flagship Level'" />
          <UiHeaderH1>{{  corporation.flagShip }}</UiHeaderH1>
        </div>
        <div>
          <UiLabel :text="'Required Influence'" />
          <UiHeaderH1>{{ corporation.requiredInfluence }}</UiHeaderH1>
        </div>
        <div>
          <UiLabel :text="'Ws Wins'" />
          <UiHeaderH1>{{ corporation.wsWins }}</UiHeaderH1>
        </div>
      </div>
    </UiCard>
  </div>
</template>