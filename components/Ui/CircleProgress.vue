<script setup lang="ts">
  const props = defineProps({
    percent: {
      type: Number,
      required: true,
      default: 0
    }
  })

  const progress = ref(props.percent)
  const circumference = 15 * 2 * Math.PI

  function smoothProgressChange(target: number): void  {
    const duration = 300; // animation time
    const start = performance.now(); // start animation time
    const initialProgress = progress.value;

    function animate() {
      const now = performance.now(); // current animatio time
      const timeElapsed = now - start;
      const progressDelta = target - initialProgress;
      progress.value = initialProgress + progressDelta * (timeElapsed / duration);
      
      // progress.value update
      if (timeElapsed < duration) {
        setTimeout(animate, 16);
      } else {
        progress.value = target;
      }
    }

    animate();
  }

  watch(() => props.percent, (newValue, _) => {
    smoothProgressChange(newValue)
  })
</script>

<template>
  <div>
    <div
      x-data="scrollProgress"
      class="inline-flex items-center justify-center overflow-hidden rounded-full"
    >
      <!-- Building a Progress Ring: https://css-tricks.com/building-progress-ring-quickly/ -->
      <svg class="w-10 h-10">
        <circle
          class="text-gray-200"
          stroke-width="4"
          stroke="currentColor"
          fill="transparent"
          r="15"
          cx="20"
          cy="20"
        />
        <circle
          class="text-gray-800"
          stroke-width="2"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="circumference - progress / 100 * circumference"
          stroke-linecap="round"
          stroke="currentColor"
          fill="transparent"
          r="15"
          cx="20"
          cy="20"
        />
      </svg>
      <span class="absolute text-[9px] text-gray-200">
        {{ progress.toFixed(0) }} %
      </span>
    </div>

  </div>
</template>