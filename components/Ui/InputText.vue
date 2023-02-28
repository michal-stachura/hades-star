<script setup lang='ts'>

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: false,
      default: ''
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      required: false,
      default: "text"
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    cssClasses: {
      type: String,
      required: false,
      default: ''
    },
    helpText: {
      type: String,
      required: false,
      default: ''
    },
    label: {
      type: String,
      required: false,
      default: ''
    }
  })
</script>


<template>
  <div class="mb-2 relative">
    <UiLabel
      v-if="label"
      :text="label"
    />
    <input
      :name="name"
      :value="value"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
      :class="cssClasses"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="bg-white/60 h-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-200 rounded text-gray-800 transition-all duration-500 px-2"
    />
    <SharedFormHelpText v-if="helpText" 
      :helpText="helpText"
    />
  </div>
</template>