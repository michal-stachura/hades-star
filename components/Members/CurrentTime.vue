<script setup lang="ts">
  import { DateTime } from 'luxon';

  const props = defineProps({
    memberTimezone: {
      type: String,
      required: false,
      default: 'UTC'
    }
  })

  const currentTime = ref<string>('')
  const isDayTime = ref<boolean>(false)

  const updateTime = () => {
    const date = DateTime.now().setZone(props.memberTimezone)
    currentTime.value = date.toFormat('HH:mm:ss')

    const hour = date.hour
    isDayTime.value = hour >= 8 && hour <= 22
  }

  onMounted(() => {
    updateTime()
    setInterval(updateTime, 1000)
  })
</script>

<template>
  <span>
    <font-awesome-icon v-if="isDayTime" class="float-right mt-1 w-4" :icon="['fad', 'sun']" />
    <font-awesome-icon v-else class="float-right mt-1 w-4" :icon="['fad', 'moon']" />
    <UiBadge
      :text="currentTime"
      class="float-right mx-1"
    />
  </span>
</template>