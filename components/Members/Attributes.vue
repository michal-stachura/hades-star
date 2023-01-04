<script setup lang="ts">
  const { getMemberShipAttributes } = useShipAttributes()

  const props = defineProps({
    memberId: {
      type: String,
      required: true,
    },
    attributeName: {
      type: String,
      required: true,
    },
    namesOnly: {
      type: Boolean,
      required: false
    }
  })

  const membersAttributes = getMemberShipAttributes(props.memberId, props.attributeName)

</script>

<template>
  <div class="flex relative">
    <div 
      v-if="props.namesOnly"
      class="absolute left-12 -top-16 bg-white/40 -rotate-90"
    >
      <div
        v-for="attribute in membersAttributes"
        :key="`attr-name${attribute.name}`"
        class="text-gray-200"
      >
        <span class="block px-4 mb-6">{{ attribute.name }}</span>
      </div>
    </div>
    <div class="flex" v-else>
      <MembersAttributeCard
        v-for="attribute in membersAttributes"
        :key="attribute.name"
        v-tooltip="attribute.name"
      >
        {{ attribute.value }}
      </MembersAttributeCard>
    </div>
  </div>
</template>