<script setup lang="ts">
  const { corpPower } = useCorporationDetails();
  </script>

<template>
  
    <div class="flex">
      <UiCircleProgress
        :progress="corpPower().overall"
        :animation-duration="1300"
        :animation-delay="300"
        :progress-thickness="5"
        :decimal-precision="2"
        :text-layout="'text-gray-200 text-xs'"
      />
      <UiCircleProgress
        :progress="corpPower().weapon"
        :animation-duration="1300"
        :animation-delay="600"
        :progress-thickness="5"
        :decimal-precision="2"
        :text-layout="'text-gray-200 text-xs'"
      />
      <UiCircleProgress
        :progress="corpPower().shield"
        :animation-duration="1300"
        :animation-delay="900"
        :progress-thickness="5"
        :decimal-precision="2"
        :text-layout="'text-gray-200 text-xs'"
      />
      <UiCircleProgress
        :progress="corpPower().support"
        :animation-duration="1300"
        :animation-delay="1200"
        :progress-thickness="5"
        :decimal-precision="2"
        :text-layout="'text-gray-200 text-xs'"
      />
      <UiCircleProgress
        :progress="corpPower().mining"
        :animation-duration="1300"
        :animation-delay="1500"
        :progress-thickness="5"
        :decimal-precision="2"
        :text-layout="'text-gray-200 text-xs'"
      />
      <UiCircleProgress
        :progress="corpPower().trade"
        :animation-duration="1300"
        :animation-delay="1800"
        :progress-thickness="5"
        :decimal-precision="2"
        :text-layout="'text-gray-200 text-xs'"
      />
    </div>
  
</template>