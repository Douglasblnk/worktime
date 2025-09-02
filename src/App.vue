<script setup lang="ts">
import { useAxios } from '@vueuse/integrations/useAxios'
import instance from './plugins/axios'
import Points from './components/Points.vue'
import { computed } from 'vue'
import type { IPoints } from './types/IPoints'
import dayjs from './plugins/dayjs'
import { isOdd } from './utils'
import Card from './components/Card.vue'
import LeaveHour from './components/LeaveHour.vue'
import useTolerance from './composables/useTolerance'
import CustomTitle from './components/CustomTitle.vue'
import type { IResume } from './types/IResume'

const currentDate = dayjs().format('YYYY-MM-DD')

const workDay = useAxios<IPoints.Root>(`time_card_control/current/work_days/${currentDate}`, instance)
const resume = useAxios<IResume.Root>(`employees/statuses/${import.meta.env.VITE_ID}`, instance)

const points = computed(() => {
  return workDay.data.value?.work_day?.time_cards
})

const { tolerance } = useTolerance(points)

function getType(index: number) {
  return isOdd(index)
    ? 'entrance'
    : 'leave'
}
</script>

<template>
  <div class="flex flex-col gap-sm">
    <div class="p-5 flex flex-col items-center gap-sm justify-center">
      <i class="i-mdi-briefcase text-3xl" />

      <CustomTitle text="Worktime" class="text-2xl font-bold font-poppins" />

      <div class="flex items-center gap-sm bg-point-entrance/20 rounded-full border-1 border-solid border-[#ffffff14] px-sm">
        <i class="i-mdi-timer-plus text-lg" />

        <span class="text-lg font-bold font-poppins">
          {{ dayjs.duration(resume.data.value.statuses.time_balance, "seconds").format('HH:mm') }}
        </span>
      </div>

      <div v-if="workDay.error.value || resume.error.value" class="flex items-center gap-sm">
        <div class="mt-lg bg-negative/40 px-md py-sm rounded-full">
          Não foi possível buscar os dados.
        </div>

        <div
          class="mt-lg bg-negative/70 w-10 h-10 flex items-center justify-center rounded-full"
          @click="() => {workDay.execute(); resume.execute()}"
        >
          <i class="i-mdi-refresh text-xl" />
        </div>
      </div>
    </div>
    
    <template v-if="!workDay.error.value && !resume.error.value">
      <Card
        icon="i-mdi-calendar-today"
        :title="dayjs().format('DD [de] MMMM [de] YYYY')"
        :is-loading="workDay.isLoading.value"
      >
        <div v-if="points.length === 0" class="text-sm">
          Nenhum ponto registrado
        </div>
  
        <template v-else>
          <Points v-for="(point, index) in points"
            :key="index"
            :hour="point.time"
            :type="getType(index + 1)"
          />
        </template>
      </Card>
  
      <Card
        icon="i-mdi-car-clock"
        :title="`${tolerance} ${tolerance === 1 ? 'minuto' : 'minutos'} de tolerância`"
        :is-loading="workDay.isLoading.value"
      >
        <div v-if="points.length === 0" class="text-sm">
          Nenhum ponto registrado
        </div>
  
        <template v-else>
          <LeaveHour :points="points" />
        </template>
      </Card>
    </template>
  </div>
</template>
