<template>
  <el-card :shadow="shadow" class="chart-card" :class="{ 'is-loading': !isVisible }" :style="{ height }">
    <div ref="holder" class="chart-holder" :style="{ height }">
      <VChart v-if="isVisible" class="chart" :option="option" autoresize @chart-ready="onChartReady" />
      <div v-else class="chart-skeleton">
        <el-skeleton :rows="4" animated />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import VChart from 'vue-echarts'

interface Props {
  option: any
  shadow?: 'never' | 'always' | 'hover'
  rootMargin?: string
  height?: string
  lazy?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  shadow: 'never',
  rootMargin: '100px',
  height: '320px',
  lazy: true
})

const holder = ref<HTMLElement | null>(null)
const isVisible = ref(!props.lazy)
const chartInstance = ref<any>(null)
let io: IntersectionObserver | null = null
let rafId = 0

onMounted(() => {
  if (!props.lazy) {
    isVisible.value = true
    return
  }
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            isVisible.value = true
            io?.disconnect()
          }
        })
      })
    }, { root: null, rootMargin: props.rootMargin, threshold: 0.01 })
    if (holder.value) io.observe(holder.value)
  } else {
    isVisible.value = true
  }
  window.addEventListener('resize', handleResize)
})

const handleResize = () => { if (chartInstance.value) chartInstance.value.resize() }
const onChartReady = (chart: any) => { chartInstance.value = chart }

onBeforeUnmount(() => {
  if (io && holder.value) io.unobserve(holder.value)
  io = null
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.chart-holder { width: 100%; height: 100%; }
.chart { width: 100%; height: 100%; }
.chart-skeleton { width: 100%; height: 100%; display: grid; place-items: center; padding: 16px; }
.chart-card.is-loading :deep(.el-card__body) { padding: 8px; }
</style>