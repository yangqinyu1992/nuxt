<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useFetch, navigateTo } from 'nuxt/app'

definePageMeta({
  title: '仪表盘'
})
import ChartCard from '~/components/ChartCard.vue'

// ========== 退出登录 ==========
const logout = async () => {
  const { error } = await useFetch('/api/auth/logout', { method: 'POST', server: false })
  if (error.value) {
    ElMessage.error('退出失败，请重试')
    return
  }
  ElMessage.success('已退出登录')
  navigateTo('/login')
}

// ========== 主题切换（明/暗） ==========
const THEME_KEY = 'dashboard_theme'
const isDark = ref(false)

const applyTheme = (dark: boolean) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }
}
onMounted(() => {
  const saved = localStorage.getItem(THEME_KEY)
  isDark.value = saved ? saved === 'dark' : false
  applyTheme(isDark.value)
})
watch(isDark, (val) => {
  localStorage.setItem(THEME_KEY, val ? 'dark' : 'light')
  applyTheme(val)
})

const themeText = computed(() => (isDark.value ? '暗色' : '明亮'))

// ========== 轻量 Loading，优化切页闪屏 ==========
const pageLoading = ref(true)
onMounted(() => {
  // 小延时以平滑展示，真实项目可与首个数据接口完成后联动
  setTimeout(() => (pageLoading.value = false), 250)
})

// ========== 全屏控制 ==========
const containerRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

const enterFullscreen = async () => {
  const el = containerRef.value
  if (el && !document.fullscreenElement) {
    await el.requestFullscreen()
  }
}
const exitFullscreen = async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen()
  }
}
const toggleFullscreen = async () => {
  if (document.fullscreenElement) {
    await exitFullscreen()
  } else {
    await enterFullscreen()
  }
}
onMounted(() => {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

// ========== 统计卡片 ==========
const statCards = ref([
  { title: '访问量', value: 12890, trend: '+12.3%', color: '#4C6EF5' },
  { title: '注册用户', value: 5230, trend: '+3.1%', color: '#20C997' },
  { title: '订单数', value: 1876, trend: '-1.2%', color: '#FAB005' },
  { title: '转化率', value: '3.85%', trend: '+0.4%', color: '#FA5252' }
])

// 公共色值（随主题变化）
const axisColor = computed(() => (isDark.value ? '#cfd3dc' : '#606266'))
const textColor = computed(() => (isDark.value ? '#e5eaf3' : '#303133'))
const gridColor = computed(() => (isDark.value ? '#2B2F36' : '#EBEEF5'))

// ========== 折线图（近七日访问） ==========
const lineOption = computed(() => ({
  title: { text: '近七日访问趋势', left: 'center', top: 8, textStyle: { fontSize: 14, color: textColor.value } },
  tooltip: { trigger: 'axis' },
  toolbox: { right: 10, feature: { saveAsImage: {}, dataZoom: {}, magicType: { type: ['line', 'bar'] } } },
  dataZoom: [{ type: 'inside' }, { type: 'slider' }],
  grid: { left: 40, right: 20, top: 50, bottom: 30 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一','周二','周三','周四','周五','周六','周日'],
    axisLine: { lineStyle: { color: axisColor.value }},
    axisLabel: { color: axisColor.value }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: gridColor.value }},
    axisLabel: { color: axisColor.value }
  },
  series: [{
    name: '访问量',
    type: 'line',
    smooth: true,
    data: [1200, 980, 1500, 1100, 1660, 1820, 2010],
    areaStyle: {},
    itemStyle: { color: '#4C6EF5' }
  }]
}))

// ========== 饼图（渠道占比） ==========
const pieOption = computed(() => ({
  title: { text: '渠道占比', left: 'center', top: 8, textStyle: { fontSize: 14, color: textColor.value } },
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: axisColor.value } },
  series: [{
    name: '占比',
    type: 'pie',
    radius: ['40%','70%'],
    center: ['50%','48%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
    label: { color: textColor.value },
    data: [
      { value: 48, name: '官网' },
      { value: 22, name: '小程序' },
      { value: 18, name: 'App' },
      { value: 12, name: '第三方' }
    ]
  }]
}))

// ========== 柱状图（品类销量） ==========
const barOption = computed(() => ({
  title: { text: '品类销量', left: 'center', top: 8, textStyle: { fontSize: 14, color: textColor.value } },
  tooltip: { trigger: 'axis' },
  toolbox: { right: 10, feature: { saveAsImage: {}, dataZoom: {}, magicType: { type: ['line', 'bar'] } } },
  brush: { toolbox: ['rect', 'clear'], xAxisIndex: 'all' },
  dataZoom: [{ type: 'inside' }, { type: 'slider' }],
  grid: { left: 40, right: 20, top: 50, bottom: 30 },
  xAxis: {
    type: 'category',
    data: ['家电','数码','美妆','服饰','食品','母婴'],
    axisLine: { lineStyle: { color: axisColor.value }},
    axisLabel: { color: axisColor.value }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: gridColor.value }},
    axisLabel: { color: axisColor.value }
  },
  series: [{
    name: '销量',
    type: 'bar',
    barWidth: 18,
    data: [620, 732, 701, 534, 690, 830],
    itemStyle: { color: '#20C997' }
  }]
}))

// ========== 新增：双轴折线图（UV/PV） ==========
const dualLineOption = computed(() => ({
  title: { text: 'UV / PV 趋势（双轴）', left: 'center', top: 8, textStyle: { fontSize: 14, color: textColor.value } },
  tooltip: { trigger: 'axis' },
  toolbox: { right: 10, feature: { saveAsImage: {}, dataZoom: {} } },
  dataZoom: [{ type: 'inside' }, { type: 'slider' }],
  grid: { left: 50, right: 50, top: 50, bottom: 30 },
  legend: { top: 28, textStyle: { color: axisColor.value } },
  xAxis: {
    type: 'category',
    data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    axisLine: { lineStyle: { color: axisColor.value }},
    axisLabel: { color: axisColor.value }
  },
  yAxis: [
    { type: 'value', name: 'UV', position: 'left', axisLabel: { color: axisColor.value }, splitLine: { lineStyle: { color: gridColor.value }} },
    { type: 'value', name: 'PV', position: 'right', axisLabel: { color: axisColor.value } }
  ],
  series: [
    { name: 'UV', type: 'line', smooth: true, yAxisIndex: 0, itemStyle: { color: '#36cfc9' }, data: [320, 402, 391, 434, 590, 630, 710] },
    { name: 'PV', type: 'line', smooth: true, yAxisIndex: 1, itemStyle: { color: '#9254de' }, data: [820, 932, 901, 934, 1290, 1330, 1520] }
  ]
}))

// ========== 新增：堆叠柱状图（渠道流量构成） ==========
const stackedBarOption = computed(() => ({
  title: { text: '渠道流量构成（堆叠）', left: 'center', top: 8, textStyle: { fontSize: 14, color: textColor.value } },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { top: 28, textStyle: { color: axisColor.value } },
  toolbox: { right: 10, feature: { saveAsImage: {}, dataZoom: {} } },
  brush: { toolbox: ['rect', 'clear'], xAxisIndex: 'all' },
  dataZoom: [{ type: 'inside' }, { type: 'slider' }],
  grid: { left: 50, right: 20, top: 60, bottom: 30 },
  xAxis: {
    type: 'category',
    data: ['1月','2月','3月','4月','5月','6月'],
    axisLine: { lineStyle: { color: axisColor.value }},
    axisLabel: { color: axisColor.value }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: gridColor.value }},
    axisLabel: { color: axisColor.value }
  },
  series: [
    { name: '官网', type: 'bar', stack: 'total', emphasis: { focus: 'series' }, itemStyle: { color: '#409EFF' }, data: [320, 302, 301, 334, 390, 330] },
    { name: 'App', type: 'bar', stack: 'total', emphasis: { focus: 'series' }, itemStyle: { color: '#67C23A' }, data: [120, 132, 101, 134, 90, 230] },
    { name: '小程序', type: 'bar', stack: 'total', emphasis: { focus: 'series' }, itemStyle: { color: '#E6A23C' }, data: [220, 182, 191, 234, 290, 330] },
    { name: '第三方', type: 'bar', stack: 'total', emphasis: { focus: 'series' }, itemStyle: { color: '#F56C6C' }, data: [150, 212, 201, 154, 190, 120] }
  ]
}))

// ========== 新增：转化漏斗 ==========
const funnelOption = computed(() => ({
  title: { text: '转化漏斗', left: 'center', top: 8, textStyle: { fontSize: 14, color: textColor.value } },
  tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
  series: [{
    name: '转化',
    type: 'funnel',
    left: '10%',
    width: '80%',
    label: { color: textColor.value },
    data: [
      { value: 100, name: '曝光' },
      { value: 72,  name: '访问' },
      { value: 38,  name: '加购' },
      { value: 22,  name: '下单' },
      { value: 15,  name: '支付' }
    ]
  }]
}))

/** 自适应：用 ResizeObserver 优化，避免频繁重绘 */
const chartKey = ref(0)
let ro: ResizeObserver | null = null
onMounted(() => {
  if ('ResizeObserver' in window && containerRef.value) {
    ro = new ResizeObserver(() => { chartKey.value++ })
    ro.observe(containerRef.value)
  } else {
    const onResize = () => { chartKey.value++ }
    window.addEventListener('resize', onResize)
  }
})
onUnmounted(() => {
  if (ro && containerRef.value) ro.unobserve(containerRef.value)
  ro = null
})
</script>

<template>
  <div class="dashboard" ref="containerRef" v-loading="pageLoading">
    <div class="header">
      <div class="title">
        <h2>运营驾驶舱</h2>
        <p>核心业务指标总览 · 实时洞察</p>
      </div>
      <div class="header-actions">
        <el-switch
          v-model="isDark"
          inline-prompt
          :active-text="'暗色'"
          :inactive-text="'明亮'"
        />
        <el-button @click="toggleFullscreen">{{ isFullscreen ? '退出全屏' : '全屏展示' }}</el-button>
        <el-divider direction="vertical" />
        <el-button @click="logout">退出登录</el-button>
        <el-button type="primary">刷新数据</el-button>
      </div>
    </div>

    <!-- 全屏网格布局 -->
    <div class="grid">
      <!-- 统计卡片 -->
      <div class="grid-row">
        <el-row :gutter="12">
          <el-col :xs="12" :sm="12" :md="6" v-for="(card, idx) in statCards" :key="idx">
            <el-card shadow="hover" class="stat-card">
              <div class="stat">
                <div class="label">{{ card.title }}</div>
                <div class="value" :style="{ color: card.color }">{{ card.value }}</div>
                <div class="trend">{{ card.trend }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 上半区：折线 + 饼图 -->
      <div class="grid-row">
        <el-row :gutter="12">
          <el-col :xs="24" :md="16">
            <ChartCard :option="lineOption" height="320px" :lazy="false" />
          </el-col>
          <el-col :xs="24" :md="8">
            <ChartCard :option="pieOption" height="320px" :lazy="false" />
          </el-col>
        </el-row>
      </div>

      <!-- 中部：双轴折线 -->
      <div class="grid-row">
        <ChartCard :option="dualLineOption" height="340px" :lazy="false" />
      </div>

      <!-- 中部：漏斗图 -->
      <div class="grid-row">
        <ChartCard :option="funnelOption" height="340px" :lazy="false" />
      </div>

      <!-- 下半区：堆叠柱 + 普通柱 -->
      <div class="grid-row">
        <el-row :gutter="12">
          <el-col :xs="24" :md="14">
            <ChartCard :option="stackedBarOption" height="340px" :lazy="false" />
          </el-col>
          <el-col :xs="24" :md="10">
            <ChartCard :option="barOption" height="340px" :lazy="false" />
          </el-col>
        </el-row>
      </div>

      <!-- 表格 -->
      <div class="grid-row">
        <el-card shadow="never">
          <template #header>
            <div class="table-header">
              <span>最新订单</span>
              <el-button link type="primary">查看全部</el-button>
            </div>
          </template>
          <el-table size="small" border :data="[
            { id: 'A20251016001', user: 'Alice', amount: 1299, status: '已支付', time: '09:12' },
            { id: 'A20251016002', user: 'Bob', amount: 289, status: '已发货', time: '09:18' },
            { id: 'A20251016003', user: 'Cindy', amount: 569, status: '待支付', time: '09:22' },
            { id: 'A20251016004', user: 'David', amount: 78, status: '已完成', time: '09:31' },
            { id: 'A20251016005', user: 'Eve', amount: 2199, status: '已完成', time: '09:34' }
          ]">
            <el-table-column prop="id" label="订单号" min-width="160" />
            <el-table-column prop="user" label="用户" min-width="100" />
            <el-table-column prop="amount" label="金额" min-width="80">
              <template #default="{ row }">¥ {{ row.amount }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="90">
              <template #default="{ row }">
                <el-tag :type="row.status.includes('待') ? 'warning' : (row.status.includes('发') ? 'info' : 'success')">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间" min-width="80" />
          </el-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style>
/* 全局主题变量（不加 scoped，挂在 :root / [data-theme='dark']） */
:root {
  --bg-page: #f5f7fa;
  --bg-card: #ffffff;
  --text-1: #303133;
  --text-2: #606266;
  --border: #e4e7ed;
}
[data-theme='dark'] {
  --bg-page: #111318;
  --bg-card: #1a1d24;
  --text-1: #e5eaf3;
  --text-2: #cfd3dc;
  --border: #30343b;
}
</style>

<style scoped>
.dashboard {
  padding: 12px;
  height: 100%;
  background: var(--bg-page);
  color: var(--text-1);
}
.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 12px;
}
.title h2 {
  margin: 0 0 4px;
}
.title p {
  margin: 0;
  color: var(--text-2);
  font-size: 13px;
}
.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 网格容器 */
.grid {
  display: grid;
  grid-auto-rows: minmax(min-content, max-content);
  gap: 12px;
}
.grid-row {
  width: 100%;
}

.stat-card :deep(.el-card__body) {
  padding: 16px;
}
.stat-card {
  background: var(--bg-card);
  border-color: var(--border);
}
.stat-card :deep(.el-card__body) {
  background: var(--bg-card);
}

.stat-card .stat {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 8px 12px;
  align-items: baseline;
}
.stat .label { color: var(--text-2); }
.stat .value { font-size: 24px; font-weight: 700; }
.stat .trend { color: #20C997; }

/* 图表卡片 */
.chart-card {
  height: 320px;
  background: var(--bg-card);
  border-color: var(--border);
}
.h-340 { height: 340px; }
.chart { width: 100%; height: 100%; }

/* 表格卡片适配主题 */
:deep(.el-card) {
  background: var(--bg-card);
  border-color: var(--border);
}
:deep(.el-table) {
  --el-table-bg-color: var(--bg-card);
  --el-table-tr-bg-color: var(--bg-card);
  --el-table-text-color: var(--text-1);
  --el-table-border-color: var(--border);
}
:deep(.el-table th) {
  color: var(--text-2);
}
:deep(.el-table .cell) {
  color: var(--text-1);
}

@media (max-width: 768px) {
  .chart-card { height: 260px; }
}
</style>