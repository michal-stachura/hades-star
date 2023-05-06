<script setup lang="ts">
  import { PropType } from 'vue';
  type ListItem = string | ListItem[];

  const props = defineProps({
    list: {
      required: true,
      type: Array as PropType<ListItem[]>
    },
    iconName: {
      required: false,
      type: String as PropType<string>,
      default: 'square-star'
    }
  })

  function CreateItem(item) {
    if (typeof item === 'string') {
      
    }
  }
</script>

<template>
  <ul class="my-4 ml-2 text-left">
    <li class="flex items-center space-x-3"
      v-for="item in list"
    >
      <font-awesome-icon :icon="['fad', props.iconName]" />
      <span>{{ item }}</span>
    </li>   
  </ul>  
</template>