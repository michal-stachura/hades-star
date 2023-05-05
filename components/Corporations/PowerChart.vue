<script setup lang="ts">
  import { CorpPower } from '@/types/corporation';

  const { corpPower } = useCorporationDetails();
  const showDetails = ref<boolean>(false)
  const attrVisible = ref<boolean>(false)
  const zeroOpacity = ref<boolean>(false)

  const corpPowerObject = ref<CorpPower>({
    weapon: 0,
    shield: 0,
    support: 0,
    mining: 0,
    trade: 0,
    overall: 0,
  })

  function displayDetails() {
    showDetails.value = !showDetails.value
    let delay = 0
    let opacityDelay = 0
    if (showDetails.value) {
      delay = 300
      opacityDelay = 310
    }
    setTimeout(() => {
      attrVisible.value = !attrVisible.value
    }, delay)
    setTimeout(() => {
      zeroOpacity.value = !zeroOpacity.value
      corpPowerObject.value.weapon = corpPower().weapon
      corpPowerObject.value.shield = corpPower().shield
      corpPowerObject.value.support = corpPower().support
      corpPowerObject.value.mining = corpPower().mining
      corpPowerObject.value.trade = corpPower().trade
    }, opacityDelay)
  }

  onMounted(() => {
    corpPowerObject.value.overall = corpPower().overall
  })

  watch(() => corpPower(), (newValue, _) => {
    corpPowerObject.value = newValue
  })
</script>

<template>
  
    <div
      v-if="corpPowerObject"
      class="flex items-end justify-end"
    >
      <div>
        <UiCircleProgress
          :progress="corpPowerObject.overall"
          :animation-duration="1300"
          :animation-delay="300"
          :text-layout="'text-sm font-bold text-gray-200'"
          :decimal-precision="2"
          :progress-thickness="20"
          :radius="40"
          :thickness="20"
          :progress-radius="40"
          :progress-color="'text-blue-500'"
          class="cursor-pointer"
          v-tooltip="{content: `<div class='text-center'>Overall power ${corpPowerObject.overall} %.<br />Click for details.</div>`, html: true}"
          @click="displayDetails()"
        />
        <UiParagraph>Corp Power</UiParagraph>
      </div>
      <div
        class="flex transition-all duration-300"
        :class="{'w-0': !showDetails, 'w-[400px]': showDetails}"
      >
        <div
          v-if="attrVisible"
          class="text-center transition-all duration-300"
          :class="{'opacity-0': !zeroOpacity, 'opacity-100': zeroOpacity}"
        >
          <UiCircleProgress
            :progress="corpPowerObject.weapon"
            :animation-duration="1300"
            :progress-thickness="4"
            :decimal-precision="2"
            :progress-color="'text-red-400'"
            :text-layout="'text-gray-200 text-xs'"
            v-tooltip="`Weapon power ${corpPowerObject.weapon} %`"
          />
          <UiParagraph>Weapon</UiParagraph>
        </div>
        <div
          v-if="attrVisible"
          class="text-center transition-all duration-300"
          :class="{'opacity-0': !zeroOpacity, 'opacity-100': zeroOpacity}"
        >
          <UiCircleProgress
            :progress="corpPowerObject.shield"
            :animation-duration="1300"
            :animation-delay="200"
            :progress-thickness="4"
            :decimal-precision="2"
            :progress-color="'text-teal-300'"
            :text-layout="'text-gray-200 text-xs'"
            v-tooltip="`Shield power ${corpPowerObject.shield} %`"
          />
          <UiParagraph>Shield</UiParagraph>
        </div>
        <div
          v-if="attrVisible"
          class="text-center transition-all duration-300"
          :class="{'opacity-0': !zeroOpacity, 'opacity-100': zeroOpacity}"
        >
          <UiCircleProgress
            :progress="corpPowerObject.support"
            :animation-duration="1300"
            :animation-delay="400"
            :progress-thickness="4"
            :decimal-precision="2"
            :progress-color="'text-green-400'"
            :text-layout="'text-gray-200 text-xs'"
            v-tooltip="`Support power ${corpPowerObject.support} %`"
          />
          <UiParagraph>Support</UiParagraph>
        </div>
        <div
          v-if="attrVisible"
          class="text-center transition-all duration-300"
          :class="{'opacity-0': !zeroOpacity, 'opacity-100': zeroOpacity}"
        >
          <UiCircleProgress
            :progress="corpPowerObject.mining"
            :animation-duration="1300"
            :animation-delay="600"
            :progress-thickness="4"
            :decimal-precision="2"
            :progress-color="'text-indigo-600'"
            :text-layout="'text-gray-200 text-xs'"
            v-tooltip="`Mining power ${corpPowerObject.mining} %`"
          />
          <UiParagraph>Mining</UiParagraph>
        </div>
        <div
          v-if="attrVisible"
          class="text-center transition-all duration-300"
          :class="{'opacity-0': !zeroOpacity, 'opacity-100': zeroOpacity}"
        >
          <UiCircleProgress
            :progress="corpPowerObject.trade"
            :animation-duration="1300"
            :animation-delay="800"
            :progress-thickness="4"
            :decimal-precision="2"
            :progress-color="'text-yellow-300'"
            :text-layout="'text-gray-200 text-xs'"
            v-tooltip="`Trade power ${corpPowerObject.trade} %`"
          />
          <UiParagraph>Trade</UiParagraph>
        </div>
      </div>
    </div>
  
</template>