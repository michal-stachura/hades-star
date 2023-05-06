<script setup lang="ts">
  import { PropType, h } from 'vue';
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

  function CreateItem(item: ListItem): string {
    if (typeof item === 'string') {
      return `<li>${item}</li>`;
    } else if (Array.isArray(item)) {
      return CreateList(item);
    } else {
      throw new Error(`Invalid list item: ${item}`);
    }

  }
  function CreateList(list: ListItem[]): string {
    return `<ul>
      ${list.map((item) => CreateItem(item))}
    </ul>`
  }
</script>

<template>
  <div>
    <span v-html="CreateList(list)"></span>
  </div>
</template>