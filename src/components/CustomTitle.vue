<script setup lang="ts">
interface ShinyTextProps {
  text: string;
  className?: string;
}

const props = defineProps<ShinyTextProps>()
</script>

<template>
  <div
    :class="`text-[#b5b5b5a4] bg-clip-text inline-block animate-shine ${props.className}`"
    :style="{
      backgroundImage:
        'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255) 50%, rgba(255, 255, 255, 0) 60%)',
      backgroundSize: '200% 100%',
      WebkitBackgroundClip: 'text',
      animationDuration: '3s'
    }"
  >
    {{ props.text }}
  </div>
</template>

<style scoped>
@keyframes shine {
  0% {
    background-position: 100%;
  }
  100% {
    background-position: -100%;
  }
}

.animate-shine {
  animation: shine 5s linear infinite;
}
</style>