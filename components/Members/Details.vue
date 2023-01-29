<script setup lang="ts">
  import { Member } from '@/types/member';
  import { PropType } from 'vue';

  const props = defineProps({
    member: {
      type: Object as PropType<Member>,
      required: true,
    }
  })

  const emit = defineEmits(['editMember'])
</script>


<template>
  <div>
    <UiHeaderH2>{{ member.name }}</UiHeaderH2>
    <UiDivider />
    <div class="flex text-gray-200">
      <div class="grow">
        <UiParagraph>Timezone</UiParagraph>
        <UiParagraph>Red Star Level</UiParagraph>
        <UiParagraph>BattleShip Level</UiParagraph>
        <UiParagraph>Max Mods</UiParagraph>
        <UiParagraph>Willing to be Leader</UiParagraph>
        <UiParagraph>Preferences</UiParagraph>
      </div>
      <div class="grow-0 text-right">
        <UiParagraph>{{ member.timeZone || '-' }}</UiParagraph>
        <UiParagraph>{{ member.rsLevel || '-' }}</UiParagraph>
        <UiParagraph>{{ member.bsLevel || '-' }}</UiParagraph>
        <UiParagraph>{{ member.maxMods || '-' }}</UiParagraph>
        <UiParagraph>{{ member.asLeader || '-' }}</UiParagraph>
        <UiParagraph>{{ member.preferences?.join(',') || '-' }}</UiParagraph>
      </div>
    </div>
    <UiDivider />
    <UiButton
      :text="'Change data'"
      :layout="'transparent'"
      :size="'sm'"
      @click="emit('editMember')"
    />
  </div>
</template>