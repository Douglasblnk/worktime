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
import WeekPoints from './components/WeekPoints.vue'

const currentDate = dayjs().format('YYYY-MM-DD')
const currentWeek = `start_date=${dayjs().startOf('week').add(1, 'd').format('YYYY-MM-DD')}&end_date=${dayjs().endOf('week').subtract(1, 'd').format('YYYY-MM-DD')}&sort_direction=desc&sort_property=date`

const workDay = useAxios<IPoints.Root>(`time_card_control/current/work_days/${currentDate}`, instance)
const workWeek = useAxios<{ work_days: IPoints.Root['work_day'][] }>(`time_card_control/current/work_days?${currentWeek}`, instance)
const resume = useAxios<IResume.Root>(`employees/statuses/${import.meta.env.VITE_ID}`, instance)

const points = computed(() => {
  return workDay.data.value?.work_day?.time_cards
})

const weekPoints = computed(() => {
  return workWeek.data.value?.work_days
})

const { tolerance, timeLeft } = useTolerance(points)

function getType(index: number) {
  return isOdd(index)
    ? 'entrance'
    : 'leave'
}
</script>

<template>
  <div class="flex flex-col gap-sm">
    <div class="p-5 flex flex-col items-center gap-md justify-center">
      <div class="flex items-center gap-sm">
        <i class="i-mdi-briefcase text-3xl" />
  
        <CustomTitle text="Worktime" class="text-2xl font-bold font-poppins" />
      </div>

      <div class="flex items-center gap-sm">
        <div class="flex items-center gap-sm bg-point-entrance/20 rounded-full border-1 border-solid border-[#ffffff14] px-sm">
          <i class="i-mdi-timer-plus text-lg" />
  
          <span v-if="!resume.isLoading.value" class="text-lg font-bold font-poppins">
            {{ dayjs.duration(resume.data.value.statuses.time_balance, "seconds").format('HH:mm') }}
          </span>
        </div>
  
        <div class="flex items-center gap-sm bg-warning/20 rounded-full border-1 border-solid border-[#ffffff14] px-sm">
          <i class="i-mdi-timer-sand-complete text-lg" />
  
          <span v-if="!resume.isLoading.value" class="text-lg font-bold font-poppins">
            {{ timeLeft }}
          </span>
        </div>
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
    
    <template v-if="!workDay.error.value && !resume.error.value && !workWeek.error.value">
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

      <Card
        icon="i-mdi-calendar-week"
        :title="`Pontos da semana (${dayjs().startOf('week').add(1, 'd').format('DD/MM')} - ${dayjs().endOf('week').subtract(1, 'd').format('DD/MM')})`"
        :is-loading="workWeek.isLoading.value"
      >
        <div v-if="weekPoints.length === 0" class="text-sm">
          Nenhum ponto registrado
        </div>
  
        <WeekPoints v-else :points="weekPoints" />
      </Card>
    </template>
  </div>
</template>
