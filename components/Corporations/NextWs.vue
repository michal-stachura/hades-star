<script setup lang="ts">
  import { PropType } from 'vue';
  import { Member } from '~/types/member';


  const props = defineProps({
    member: {
      required: true,
      type: Object as PropType<Member>
    }
  })
</script>


<template>
  <div>
    <UiCard
      class="w-10 text-center mx-auto cursor-pointer"
    >
      {{ props.member.nextWs || '-' }}
    </UiCard>
  </div>
</template>