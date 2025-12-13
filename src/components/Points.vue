<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  type?: 'entrance' | 'leave'
  hour: string
  small?: boolean
}>()

const typeIcon = computed(() => {
  return props.type === 'entrance'
    ? 'i-mdi-account-arrow-down'
    : 'i-mdi-account-arrow-up'
})

const typeColor = computed(() => {
  return props.type === 'entrance'
    ? 'bg-point-entrance/30'
    : 'bg-point-leave/30'
})

const tooltipModel = ref<Record<string, boolean>>({})
const tooltipStyle = ref({})

const typeText = {
  entrance: 'Entrada',
  leave: 'Saída',
}

function handleTooltipOn(value: MouseEvent) {
  const { clientX, clientY } = value
  tooltipStyle.value = {
    position: 'fixed',
    top: `${clientY + 10}px`,
    left: `${clientX + 10}px`,
  }

  tooltipModel.value[props.hour] = true
}

function handleTooltipOff() {
  tooltipStyle.value = {}
  tooltipModel.value[props.hour] = false
}
</script>

<template>
  <div
    class="w-full px-3 py-2 rounded-full flex gap-xs justify-center items-center border-1 border-solid border-[#ffffff14]"
    :class="[type && typeColor, props.small ? '!px-2 !py-1' : '']"
    @mouseenter="handleTooltipOn"
    @mouseleave="handleTooltipOff"
  >
    <i v-if="type" :class="typeIcon" class="text-lg" />
    <span class="text-sm font-semibold" :class="props.small ? '!text-xs' : 'text-base'">{{ hour }}</span>

    <Transition name="fade-in" mode="out-in">
      <div
        v-if="tooltipModel[hour]"
        :style="tooltipStyle"
        class="bg-primary/40 px-md py-2 backdrop-blur rounded-full absolute pointer-events-none z-1"
      >
        {{ typeText[type!] }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-in-enter-active,
.fade-in-leave-active {
  transition: all 0.2s ease;
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>