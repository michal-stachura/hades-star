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
    <UiCard
      :header="true"
      class="mb-2"
    >
      <template #header>
        <UiHeaderH1>Release history</UiHeaderH1>
      </template>
      <UiHeaderH2 class="mb-2">
        2023-05-06 <small>v. 1.2</small>
      </UiHeaderH2>
      <UiParagraph>
        <strong>Features</strong>
        <UiUl 
          :list="[
            'aaa',
            'bbb',
            'ccc'
          ]"
        />
        <UiUl 
          :list="[
            'Filtering members by its next WS status',
            'Filtering members by its tech level + filters management',
            'Sync corporation data with HadesStar Compendium app',
            'Display Members current time depending on members timezone',
            'Power corp component with corporation percentage progress in tech levels'
          ]"
        />
        <strong>Bug Fixes</strong>
        <UiUl 
          :list="[
            'Move corp fetching data to composables',
            'Better LocalStorage app object'
          ]"
        />
      </UiParagraph>
      <UiHeaderH2 class="mb-2">
        2023-02-13 <small>v. 1.1</small>
      </UiHeaderH2>
      <UiParagraph>
        <strong>Features</strong>
        <UiUl 
          :list="[
            'Build base app scheleton',
            'Prepared mechanism to secure the date of Corporations',
            'Base Corp functionalities',
            [
              'Managing corporation data',
              'Managing members + their attributes',
              ['aaa', 'sss']
            ]
          ]"
        />
      </UiParagraph>
    </UiCard>
    <UiCard>
      <UiInfo>
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
        
      </UiInfo>
    </UiCard>

    <UiFooter>
      <UiBadge :text="'App version 1.2'" />
    </UiFooter>
  </div>
</template>
