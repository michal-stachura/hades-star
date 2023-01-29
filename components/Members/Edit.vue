<script setup lang="ts">
  import { Member } from '@/types/member';
  import { PropType } from 'vue';

  const props = defineProps({
    member: {
      type: Object as PropType<Member>,
      required: true,
    }
  })

  const emit = defineEmits(['cancelEditMember'])
</script>


<template>
  <div>
    <UiHeaderH2>Edit form</UiHeaderH2>
    <UiDivider />
    <div class="flex text-gray-200">
      <div class="grow">
        Labels
      </div>
      <div class="grow-0 text-right">
        Values
      </div>
    </div>
    <UiDivider />
    <UiButton
      :text="'Cancel'"
      :layout="'transparent'"
      :size="'sm'"
      @click="emit('cancelEditMember')"
    />
  </div>
</template>