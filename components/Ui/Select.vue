<script setup lang="ts">
  import {PropType } from 'vue';


  const props = defineProps({
    values: {
      type: Array as PropType<String[]>,
      required: true
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    selected: {
      type: String,
      required: true
    }
  })
  const selectedValue = ref();

  function isSelected(value: String): boolean {
    if (value === props.selected) {
      return true;
    }
    return false;
  }
</script>


<template>
  <div>
    <UiLabel
      v-if="label"
      :text="label"
    />
    <select
      class="bg-white/60 h-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-200 rounded text-gray-800 transition-all duration-500 px-2"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="value in props.values"
          :value="value"
          :selected="isSelected(value)"
        >
          {{value}}
        </option>
    </select>
  </div>  
</template>