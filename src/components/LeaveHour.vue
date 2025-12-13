<script setup lang="ts">
import type { IPoints } from '../types/IPoints'
import useTolerance from '../composables/useTolerance'
import { computed } from 'vue';

const props = defineProps<{
  points: IPoints.Timecards[]
}>()

const { calcLeaveTime, calcToleranceLeaveTime } = useTolerance(props.points)

const firstEntrance = computed(() => {
  const { time } = props.points[0]

  return time
})

const leaveTime = computed(() => {
  return calcLeaveTime(firstEntrance.value)
})

const tolerateLeaveTime = computed(() => {
  return calcToleranceLeaveTime(firstEntrance.value)
})

const customClass = computed(() => {
  return {
    'opacity-30': leaveTime.value === tolerateLeaveTime.value,
  }
})
</script>

<template>
  <div class="w-full flex justify-around items-center">
    <div class="flex flex-col">
      <span class="text-3xl text-point-entrance font-bold font-poppins">{{ leaveTime }}</span>

      <div class="flex items-end gap-xs text-gray">
        <i class="i-mdi-account-arrow-up text-xl" />
        <span class="text-gray leading-none text-sm">Saída</span>
      </div>
    </div>

    <div class="h-10 border-1 border-solid border-primary" />

    <div class="flex flex-col" :class="customClass">
      <span class="text-3xl text-point-leave font-bold font-poppins">{{ tolerateLeaveTime }}</span>
      
      <div class="flex items-end gap-xs text-gray">
        <i class="i-mdi-account-arrow-up text-xl" />
        <span class="text-gray leading-none text-sm">Saída tolerável</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-bg {
  background: #ffffff0f;
  border: 1px solid #ffffff14;
}
</style>