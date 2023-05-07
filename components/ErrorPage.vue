<template>
  <div class="text-center w-full mt-8">
    <UiHeaderH1>Something went wrong</UiHeaderH1>
    <font-awesome-icon icon="fa-duotone fa-face-sad-sweat" class="text-white text-8xl mt-8 mb-10" />
    <UiParagraph>
      Some unexpected error occurred. Please go back and try again later.
    </UiParagraph>
    <NuxtLink to="/">
      <UiButton :text="'Homepage'" />
    </NuxtLink>
  </div>
</template>