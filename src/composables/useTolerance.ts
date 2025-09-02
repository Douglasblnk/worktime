import { computed, unref, type MaybeRef } from "vue"
import dayjs from '../plugins/dayjs'
import type { IPoints } from "../types/IPoints"
import type { Dayjs } from "dayjs"

const TOLERANCE = 10

const JOURNEY = dayjs.duration({ hours: 8, minutes: 48 })
const LUNCH_TIME = dayjs.duration({ hours: 1, minutes: 5 })

const TOLERANCE_PERIOD: Record<string, { hour: Dayjs, type: 'after' | 'before' }> = {
  1: {
    hour: dayjs('7:30', 'HH:mm'),
    type: 'after',
  },
  2: {
    hour: dayjs('11:55', 'HH:mm'),
    type: 'before',
  },
  3: {
    hour: dayjs('13:00', 'HH:mm'),
    type: 'after',
  },
}

export default function (points: MaybeRef<IPoints.Timecards[]>) {
  const tolerance = computed(() => {
    const unrefPoints = unref(points)

    if (!points || !unrefPoints?.length)
      return TOLERANCE

    if (unrefPoints.length > 4)
      return 0

    const calculatedTolerance = unrefPoints.reduce((acc, value, index) => {
      const toleranceObj = TOLERANCE_PERIOD[index + 1]
      const firstEntrance = dayjs(value.time, 'HH:mm')
      
      if (!toleranceObj)
        return acc

      const diff = toleranceObj.type === 'after'
        ? toleranceObj.hour.diff(firstEntrance, 'm')
        : firstEntrance.diff(toleranceObj.hour, 'm')

      if (diff < 0) {
        acc += diff
      }

      return acc
    }, TOLERANCE)

    return calculatedTolerance < 0 ? 0 : calculatedTolerance
  })

  function calcLeaveTime(entrance: string) {
    const entranceDayjs = dayjs(entrance, "HH:mm");
    const total = JOURNEY.add(LUNCH_TIME);

    const leave = entranceDayjs.add(total);
    
    return leave.format("HH:mm");
  }

  function calcToleranceLeaveTime(entrance: string) {
    const entranceDayjs = dayjs(entrance, "HH:mm");
    const total = JOURNEY.add(LUNCH_TIME).subtract(tolerance.value, "minutes");

    const leave = entranceDayjs.add(total);
    
    return leave.format("HH:mm");
  }

  return {
    tolerance,
    calcLeaveTime,
    calcToleranceLeaveTime
  }
}