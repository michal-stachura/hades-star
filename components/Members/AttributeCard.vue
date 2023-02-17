<script setup lang="ts">
  import { PropType } from 'vue';
  import { Attribute } from '@/types/ship-attribute';
  
  const { $reslugify } = useNuxtApp();
  const props = defineProps({
    attribute: {
      type: Object as PropType<Attribute>,
      required: true
    },
    iconsOnly: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  const tooltipText = (attribute: Attribute): String | null => {
    switch(true) {
      case props.iconsOnly: {
        return $reslugify(attribute.name)
      }
      default: {
        return null
      }
    }
  }
</script>

<template>
  <UiCard
    class="mr-1"
    :class="{
      'bg-orange-200/30': attribute.value === attribute.max && !iconsOnly,
      'opacity-60': attribute.value === 0 && !iconsOnly
    }"
    v-tooltip="{content: tooltipText(attribute)}"
  >
    <div
      class="w-6 text-center"
    >
      <nuxt-img
        v-if="props.iconsOnly"
        :src="`../../images/${$slugify(attribute.name)}.png`"
        loading="lazy"
      />
      <span v-else>
        {{ attribute.value }}
      </span>
    </div>
  </UiCard>
</template>