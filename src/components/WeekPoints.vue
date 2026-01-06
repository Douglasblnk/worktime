<script setup lang="ts">
import type { IPoints } from '../types/IPoints';
import { capitalizeFirstLetter, isOdd } from '../utils';
import dayjs from '../plugins/dayjs'
import Points from './Points.vue';
import { computed } from 'vue';

const props = defineProps<{
  points: IPoints.Root['work_day'][]
}>()

function getType(index: number) {
  return isOdd(index)
    ? 'entrance'
    : 'leave'
}

const filterPoints = computed(() => {
  return props.points.filter(day => day.time_cards.length > 0)
})
</script>

<template>
  <div class="flex flex-col gap-sm w-full relative" :class="filterPoints.length > 1 ? 'mt-5' : ''">
    <div
      v-for="day in filterPoints"
      :key="day?.date"
      class="flex flex-col gap-md bg-#2e2d38 w-full px-md py-sm rounded-xl"
      style="box-shadow: 0px -10px 30px -20px black;"
      :class="(day.date === dayjs().format('YYYY-MM-DD') && filterPoints.length > 1) ? 'scale-92 absolute top--6 z-0' : 'z-10'"
    >
      <div class="flex justify-between gap-xs">
        <div class="font-semibold text-sm">
          {{ capitalizeFirstLetter(dayjs(day.date).format('dddd')) }}, {{ dayjs(day.date).format('DD') }}
        </div>

        <div
          class="flex items-center gap-sm bg-point-entrance/20 rounded-full border-1 border-solid border-[#ffffff14] px-sm"
          :class="day.extra_time > 0 ? '' : 'hidden'"
        >
          <i class="i-mdi-timer-plus text-xs" />
  
          <span class="text-xs font-bold font-poppins">
            {{ dayjs.duration(day.extra_time, 'seconds').format('HH:mm') }}
          </span>
        </div>

        <div
          class="flex items-center gap-sm bg-point-leave/20 rounded-full border-1 border-solid border-[#ffffff14] px-sm"
          :class="day.missing_time > 0 ? '' : 'hidden'"
        >
          <i class="i-mdi-timer-minus text-xs" />
  
          <span class="text-xs font-bold font-poppins">
            {{ dayjs.duration(day.missing_time, 'seconds').format('HH:mm') }}
          </span>
        </div>
      </div>
      

      <div class="flex gap-sm">
        <Points
          v-for="(point, index) in day.time_cards"
          :key="point.time + index"
          :type="getType(index + 1)"
          :hour="point.time"
          small
          hide-tooltip
          :class="day.time_cards.length >= 4 ? 'w-full' : ''"
        />
      </div>
    </div>
  </div>
</template>