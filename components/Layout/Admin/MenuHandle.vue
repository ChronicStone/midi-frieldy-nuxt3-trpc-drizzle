<script setup lang="ts">
const { open } = defineModels<{ open: boolean }>();
</script>

<template>
  <nav
    class="cursor-pointer transition-all ease-in-out duration-150 relative transform"
    @click="open = !open"
  >
    <!-- <NIcon :size="25">
      <i:ci-hamburger />
    </NIcon> -->

    <div
      :class="[
        'relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all duration-200 ',
      ]"
    >
      <div
        :class="[
          'flex flex-col justify-between w-[20px] h-[20px] transition-all duration-300 origin-center overflow-hidden',
          { '-translate-x-1.5 rotate-180': !open },
        ]"
      >
        <div
          :class="[
            'bg-gray-500 h-[2px] w-7 transition-all duration-300 origin-left  delay-150',
            { 'rotate-[42deg] !w-2/3': !open },
          ]"
        />
        <div
          :class="[
            'bg-gray-500 h-[2px] w-7 rounded transition-all duration-300',
            { 'translate-x-10': !open },
          ]"
        />
        <div
          :class="[
            'bg-gray-500 h-[2px] w-7 transition-all duration-300 origin-left  delay-150',
            { '-rotate-[42deg] !w-2/3': !open },
          ]"
        />
      </div>
    </div>
  </nav>
</template>
