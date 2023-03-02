<script setup lang="ts">
  const props = defineProps({
    progress: {
      required: true,
      type: Number,
    },
    animationDuration: {
      required: false,
      type: Number,
      default: 1000,
    },
    animationDelay: {
      required: false,
      type: Number,
      default: 0,
    },
    decimalPrecision: {
      required: false,
      type: Number,
      default: 0,
    },
    textLayout: {
      required: false,
      type: String,
      default: 'text-lg'
    },
    radius: {
      required: false,
      type: Number,
      default: 30
    },
    progressRadius: {
      required: false,
      type: Number,
      default: 30
    },
    thickness: {
      required: false,
      type: Number,
      default: 4
    },
    cx: {
      required: false,
      type: Number,
      default: 40
    },
    cy: {
      required: false,
      type: Number,
      default: 40
    },
    color: {
      required: false,
      type: String,
      default: 'text-gray-200'
    },
    progressColor: {
      required: false,
      type: String,
      default: 'text-gray-800'
    },
    progressThickness: {
      required: false,
      type: Number,
      default: 2
    },
    progressCx: {
      required: false,
      type: Number,
      default: 40
    },
    progressCy: {
      required: false,
      type: Number,
      default: 40
    },
    containerWidth: {
      required: false,
      type: String,
      default: 'w-20'
    },
    containerHeight: {
      required: false,
      type: String,
      default: 'h-20'
    },
  })

  const progress = ref<number>(props.progress);
  const circumference:number = props.progressRadius * 2 * Math.PI

  watch(() => props.progress, (newValue, _) => {
    setTimeout(() => {
      smoothProgressChange(newValue)
    }, props.animationDelay)
  })

  function smoothProgressChange(target: number): void  {
    const duration = props.animationDuration; // animation time
    const start = performance.now(); // start animation time
    const initialProgress = progress.value;

    function animate() {
      const now = performance.now(); // current animation time
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
</script>

<template>
  <div>
    <div
      class="inline-flex items-center justify-center overflow-hidden rounded-full"
    >
      <svg
        :class="`${props.containerWidth} ${props.containerHeight}`">
        <circle
          :class="`${props.color}`"
          :stroke-width="props.thickness"
          stroke="currentColor"
          fill="transparent"
          :r="props.radius"
          :cx="props.cx"
          :cy="props.cy"
        />
        <circle
          :class="`${props.progressColor}`"
          :stroke-width="props.progressThickness"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="circumference - progress / 100 * circumference"
          stroke-linecap="butt"
          stroke="currentColor"
          fill="transparent"
          :r="props.progressRadius"
          :cx="props.progressCx"
          :cy="props.progressCy"
        />
      </svg>
      <span
        :class="`absolute ${props.textLayout}`"
      >
        {{ progress.toFixed(props.decimalPrecision) }} %
      </span>
    </div>
  </div>
</template>