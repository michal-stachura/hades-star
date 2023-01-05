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
    <div 
      v-if="props.iconsOnly"
      class="flex"
    >
    <MembersAttributeCard
      v-for="attribute in membersAttributes"
      v-tooltip="attribute.name"
    >
      <nuxt-img
        :src="`/images/${$slugify(attribute.name)}.png`"
        loading="lazy"
      />
    </MembersAttributeCard>
    </div>
    <div class="flex" v-else>
      <MembersAttributeCard
        v-for="attribute in membersAttributes"
        :key="attribute.name"
      >
        {{ attribute.value }}
      </MembersAttributeCard>
    </div>
  </div>
</template>