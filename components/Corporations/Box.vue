<script setup lang="ts">
  import { PropType } from 'vue';
  import { Corporation } from '@/types/corporation';

  
  const props = defineProps({
    corporation: {
      type: Object as PropType<Corporation>,
      required: true
    }
  })

</script>

<template>
  <div>
    <NuxtLink :to="`/corporations/${corporation.id}`">
      <UiCard>
        <div class="flex">
          <div class="grow">{{ corporation.name }}</div>
          <div>
            <font-awesome-icon icon="fa-duotone fa-users" /> {{  corporation.membersCount }}
          </div>
        </div>
      </UiCard>
    </NuxtLink>
  </div>
</template>