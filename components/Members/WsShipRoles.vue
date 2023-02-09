<script setup lang='ts'>
  import { PropType } from 'vue';
  import wsShipRoles from '@/data/wsShipRoles';

  const props = defineProps({
    shipRoles: {
      required: true,
      type: Array as PropType<string[]>
    }
  })

  function wsShipRoleName(shipRole: string): string {
    return wsShipRoles.filter((el) => {
      return el.code === shipRole
    })[0].name
  }
</script>

<template>
  <div>
    <UiBadge
      v-for="memberShipRole in shipRoles"
      :text="wsShipRoleName(memberShipRole)"
    />
  </div>
</template>