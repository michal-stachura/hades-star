<script setup lang="ts">
  const { getMemberShipAttributes } = useShipAttributes();

  const props = defineProps({
    memberId: {
      type: String,
      required: true,
    },
    attributeName: {
      type: String,
      required: true,
    },
    iconsOnly: {
      type: Boolean,
      required: false
    }
  })
  const membersAttributes = getMemberShipAttributes(props.memberId, props.attributeName)
</script>

<template>
  <div class="flex">
      <MembersAttributeCard
        v-for="attribute in membersAttributes"
        :key="attribute.name"
        :attribute="attribute"
        :iconsOnly="iconsOnly"
      />    
  </div>
</template>