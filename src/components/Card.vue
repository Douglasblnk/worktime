<script setup lang="ts">
defineProps<{
  icon: string
  title?: string
  isLoading: boolean
}>()
</script>

<template>
  <div class="bg-primary/20 mt-md rounded-xl p-5 flex relative">
    <div class="bg-primary flex text-md items-center justify-center gap-sm font-black w-10 h-10 rounded-full absolute top--4 left-2 shadow">
      <i :class="icon" class="text-xl" />
    </div>

    <div class="bg-primary flex text-sm items-center gap-sm px-sm rounded-full absolute top--2 left-14 shadow">
      {{ title }}
    </div>

    <div class="mt-lg flex flex-wrap justify-center w-full gap-sm">
      <template v-if="isLoading">
        <i class="i-mdi-loading text-3xl animate-spin" />
      </template>

      <template v-else>
        <slot />
      </template>
    </div>
  </div>
</template>