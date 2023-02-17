<script setup lang="ts">
  const { $clipboard } = useNuxtApp()
  const emailCopied = ref(false)

  function copyEmail() {
    $clipboard('michal.stachura@santri.pl')
    emailCopied.value = true;
    setTimeout(() => {
      emailCopied.value = false;
    }, 2000)
  }
</script>

<template>
  <div>
    <UiHeaderH1>Hades Star</UiHeaderH1>
    <UiParagraph>
      Hello my friend!
    </UiParagraph>
    <UiParagraph>
      Welcome to Hades Star online serive which can help you improve your Empire :)
    </UiParagraph>
    <UiParagraph>
      Add your corporation and share details with your colleagues. Plan White Star battles, update corporation stats and many more.
    </UiParagraph>
    <UiDivider />
    <UiCard>
      <UiInfo>
        This is the early stage of this service.
        <UiParagraph class="mt-4">
          If you have any ideas for new functionalities please contact me at:
          <span
            class="underline cursor-pointer"
            @click="copyEmail"
          >
            michal.stachura@santri.pl
            <font-awesome-icon
              class="ml-1"
              icon="fa-duotone fa-copy"
            />
          </span>
          <UiBadge
            v-if="emailCopied"
            :text="'Copied'"
            class="float-right mr-0 mt-1"
          />
        </UiParagraph>
      </UiInfo>
    </UiCard>

    <UiFooter>
      <UiBadge :text="'App version 1.0'" />
    </UiFooter>
  </div>
</template>
