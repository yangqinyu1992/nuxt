<template>
  <el-card :shadow="shadow" class="chart-card" :class="{ 'is-loading': !isVisible }">
    <ClientOnly>
      <div ref="holder" class="chart-holder">
        <v-chart v-if="isVisible" class="chart" :option="option" autoresize />
        <div v-else class="chart-skeleton">
          <el-skeleton :rows="4" animated />
        </div>
      </div>
    </ClientOnly>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  option: any
  shadow?: 'never' | 'always' | 'hover'
  rootMargin?: string
}
const props = withDefaults(defineProps<Props>(), {
  shadow: 'never',
  rootMargin: '100px'
})

const holder = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let io: IntersectionObserver | null = null
let rafId = 0

onMounted(() => {
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      // raf 去抖，避免抖动
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
    // 降级：无 IO 则直接渲染
    isVisible.value = true
  }
})

onBeforeUnmount(() => {
  if (io && holder.value) io.unobserve(holder.value)
  io = null
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.chart-holder { width: 100%; height: 100%; }
.chart { width: 100%; height: 100%; }
.chart-skeleton { width: 100%; height: 100%; display: grid; place-items: center; padding: 16px; }
.chart-card.is-loading :deep(.el-card__body) { padding: 8px; }
</style>