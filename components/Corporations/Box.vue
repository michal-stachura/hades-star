<script setup lang="ts">
  import { PropType } from 'vue';
  import { Corporation } from '~/types/corporation';

  
  const props = defineProps({
    corporation: {
      type: Object as PropType<Corporation>,
      required: true
    }
  })

</script>

<template>
  <NuxtLink :to="`/corporations/${corporation.id}`">
    <div class="mb-4 bg-white/10 rounded p-2 flex text-gray-200">
      <div class="grow">{{ corporation.name }}</div>
      <div>
        <font-awesome-icon icon="fa-duotone fa-users" /> {{  corporation.members }}
      </div>
    </div>
  </NuxtLink>
</template>