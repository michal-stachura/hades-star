<script setup lang="ts">
  const { corporation, corpPower } = useCorporationDetails();
  const overallPower = ref<number>(0)
  const weaponPower = ref<number>(0)
  const shieldPower = ref<number>(0)
  const supportPower = ref<number>(0)
  const miningPower = ref<number>(0)
  const tradePower = ref<number>(0)

  onMounted(() => {
    const corpPowerObject = corpPower()
    overallPower.value = corpPowerObject.overall
    weaponPower.value = corpPowerObject.weapon
    shieldPower.value = corpPowerObject.shield
    supportPower.value = corpPowerObject.support
    miningPower.value = corpPowerObject.mining
    tradePower.value = corpPowerObject.trade
  })
</script>

<template>
  
    <div class="flex">
      <UiCircleProgress
        :progress="overallPower"
        :animation-duration="1300"
        :animation-delay="300"
        :progress-thickness="5"
        :decimal-precision="2"
        :text-layout="'text-gray-200 text-xs'"
      />
      <UiCircleProgress
        :progress="weaponPower"
        :animation-duration="1300"
        :animation-delay="600"
        :progress-thickness="5"
        :decimal-precision="2"
        :text-layout="'text-gray-200 text-xs'"
      />
      <UiCircleProgress
        :progress="shieldPower"
        :animation-duration="1300"
        :animation-delay="900"
        :progress-thickness="5"
        :decimal-precision="2"
        :text-layout="'text-gray-200 text-xs'"
      />
      <UiCircleProgress
        :progress="supportPower"
        :animation-duration="1300"
        :animation-delay="1200"
        :progress-thickness="5"
        :decimal-precision="2"
        :text-layout="'text-gray-200 text-xs'"
      />
      <UiCircleProgress
        :progress="miningPower"
        :animation-duration="1300"
        :animation-delay="1500"
        :progress-thickness="5"
        :decimal-precision="2"
        :text-layout="'text-gray-200 text-xs'"
      />
      <UiCircleProgress
        :progress="tradePower"
        :animation-duration="1300"
        :animation-delay="1800"
        :progress-thickness="5"
        :decimal-precision="2"
        :text-layout="'text-gray-200 text-xs'"
      />
    </div>
  
</template>