import { computed, unref, type MaybeRef } from "vue"
import dayjs from '../plugins/dayjs'
import type { IPoints } from "../types/IPoints"

const TOTAL_TOLERANCE = 10

const JOURNEY = dayjs.duration({ hours: 8, minutes: 48 })
const LUNCH_TIME = dayjs.duration(65, 'minutes')

export default function (points: MaybeRef<IPoints.Timecards[]>) {
  const tolerance = computed(() => {
    const unrefPoints = unref(points)
    
    let totalTolerance = TOTAL_TOLERANCE

    if (!points || !unrefPoints?.length)
      return TOTAL_TOLERANCE

    if (unrefPoints.length > 4)
      return 0

    if (unrefPoints[0]) {
      const entranceDiff = dayjs('7:30', 'HH:mm').diff(dayjs(unrefPoints[0].time, 'HH:mm'), 'm')
      
      if (entranceDiff < 0) {
        totalTolerance += entranceDiff
      }
    }

    if (unrefPoints[1] && unrefPoints[2]) {
      const lunchDiff = dayjs(unrefPoints[1].time, 'HH:mm').diff(dayjs(unrefPoints[2].time, 'HH:mm'), 'm')

      if ((lunchDiff + 65) < 0) {
        totalTolerance += lunchDiff + 65
      }
    }

    return totalTolerance < 0 ? 0 : totalTolerance
  })

  const timeLeft = computed(() => {
    const unrefPoints = unref(points)
    
    if (!unrefPoints || !unrefPoints?.length)
      return '--:--'

    if (unrefPoints.length >= 4)
      return '--:--'

    const entrance = dayjs(unrefPoints[0].time, 'HH:mm')
    const lunchStart = unrefPoints[1] ? dayjs(unrefPoints[1].time, 'HH:mm') : null
    const lunchEnd = unrefPoints[2] ? dayjs(unrefPoints[2].time, 'HH:mm') : null
    const now = dayjs('15:24', 'HH:mm')

    const entranceDiff = dayjs(entrance, 'HH:mm').diff(now, 'm')
    
    if (lunchStart && lunchEnd) {
      const lunchDiff = dayjs(lunchStart, 'HH:mm').diff(dayjs(lunchEnd, 'HH:mm'), 'm')
      const toleranceDiff = TOTAL_TOLERANCE - tolerance.value

      if (toleranceDiff >= 10) {
        return JOURNEY.add(-lunchDiff, 'minutes').subtract(-entranceDiff, 'minutes').format('HH:mm')
      }

      return JOURNEY.add(-lunchDiff - toleranceDiff, 'minutes').subtract(-entranceDiff, 'minutes').format('HH:mm')
    }

    return JOURNEY.subtract(-entranceDiff, 'minutes').format('HH:mm')
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
    timeLeft,
    tolerance,
    calcLeaveTime,
    calcToleranceLeaveTime
  }
}