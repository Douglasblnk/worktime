import { computed, unref, type MaybeRef } from "vue"
import dayjs from '../plugins/dayjs'
import type { IPoints } from "../types/IPoints"

const totalTolerance = 10

const JOURNEY = dayjs.duration({ hours: 8, minutes: 48 })
const LUNCH_TIME = dayjs.duration({ hours: 1, minutes: 5 })

export default function (points: MaybeRef<IPoints.Timecards[]>) {
  const tolerance = computed(() => {
    const unrefPoints = unref(points)
    
    let t = totalTolerance

    if (!points || !unrefPoints?.length)
      return totalTolerance

    if (unrefPoints.length > 4)
      return 0

    const entranceDiff = dayjs('7:30', 'HH:mm').diff(dayjs(unrefPoints[0].time, 'HH:mm'), 'm')
    
    if (entranceDiff < 0) {
      t += entranceDiff
    }
    
    const lunchDiff = dayjs(unrefPoints[1].time, 'HH:mm').diff(dayjs(unrefPoints[2].time, 'HH:mm'), 'm')
    
    if ((lunchDiff + 65) < 0) {
      t += lunchDiff + 65
    }

    return t < 0 ? 0 : t
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