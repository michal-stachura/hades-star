<script setup lang="ts">
  import { PropType, h } from 'vue';
  type ListItem = string | ListItem[];

  const props = defineProps({
    list: {
      required: true,
      type: Array as PropType<ListItem[]>
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
    return `<ul class="my-1 ml-6 list-disc">
      ${list.map((item) => CreateItem(item)).join('')}
    </ul>`;
  }
</script>

<template>
  <div>
    <span v-html="CreateList(list)"></span>
  </div>
</template>