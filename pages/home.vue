<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue'
import { ElMessage } from 'element-plus'


definePageMeta({
  title: '仪表盘'
})

// 懒加载图表组件
const ChartCard = defineAsyncComponent(() => import('~/components/ChartCard.vue'))

// ========== 退出登录 ==========
const logout = async () => {
  const { error } = await useFetch('/api/auth/logout', { method: 'POST', server: false })
  if (error.value) {
    ElMessage.error('退出失败，请重试')
    return
  }
  ElMessage.success('已退出登录')
  await nextTick()
  navigateTo('/login')
}

/* 主题切换（仅代理全局状态，不自管状态，避免与布局冲突） */
const THEME_KEY = 'dashboard_theme'
const isDark = computed({
  get() {
    if (typeof document === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  },
  set(val: boolean) {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.setAttribute('data-theme', val ? 'dark' : 'light')
    if (val) root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem(THEME_KEY, val ? 'dark' : 'light') } catch {}
  }
})

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
  dataZoom: [{ type: 'inside' }, { type: 'slider', height: 10, handleSize: '80%', fillerColor: 'rgba(64,158,255,0.25)', backgroundColor: 'rgba(64,158,255,0.08)' }],
  grid: { left: 40, right: 20, top: 50, bottom: 40, containLabel: true },
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



onMounted(async () => {
  setTimeout(() => (pageLoading.value = false), 250)
})

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
  dataZoom: [{ type: 'inside' }, { type: 'slider', height: 10, handleSize: '80%', fillerColor: 'rgba(64,158,255,0.25)', backgroundColor: 'rgba(64,158,255,0.08)' }],
  grid: { left: 40, right: 20, top: 50, bottom: 40, containLabel: true },
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
    itemStyle: { color: '#20C997', borderRadius: [6, 6, 0, 0] }
  }]
}))

// ========== 新增：双轴折线图（UV/PV） ==========
const dualLineOption = computed(() => ({
  title: { text: 'UV / PV 趋势（双轴）', left: 'center', top: 8, textStyle: { fontSize: 14, color: textColor.value } },
  tooltip: { trigger: 'axis' },
  toolbox: { right: 10, feature: { saveAsImage: {}, dataZoom: {} } },
  dataZoom: [{ type: 'inside' }, { type: 'slider', height: 10, handleSize: '80%', fillerColor: 'rgba(64,158,255,0.25)', backgroundColor: 'rgba(64,158,255,0.08)' }],
  grid: { left: 50, right: 50, top: 50, bottom: 50, containLabel: true },
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
  dataZoom: [{ type: 'inside' }, { type: 'slider', height: 10, handleSize: '80%', fillerColor: 'rgba(64,158,255,0.25)', backgroundColor: 'rgba(64,158,255,0.08)' }],
  grid: { left: 50, right: 20, top: 60, bottom: 50, containLabel: true },
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
    { name: '官网', type: 'bar', stack: 'total', emphasis: { focus: 'series' }, itemStyle: { color: '#409EFF', borderRadius: [6, 6, 0, 0] }, data: [320, 302, 301, 334, 390, 330] },
    { name: 'App', type: 'bar', stack: 'total', emphasis: { focus: 'series' }, itemStyle: { color: '#67C23A', borderRadius: [6, 6, 0, 0] }, data: [120, 132, 101, 134, 90, 230] },
    { name: '小程序', type: 'bar', stack: 'total', emphasis: { focus: 'series' }, itemStyle: { color: '#E6A23C', borderRadius: [6, 6, 0, 0] }, data: [220, 182, 191, 234, 290, 330] },
    { name: '第三方', type: 'bar', stack: 'total', emphasis: { focus: 'series' }, itemStyle: { color: '#F56C6C', borderRadius: [6, 6, 0, 0] }, data: [150, 212, 201, 154, 190, 120] }
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
      </div>
    </div>

    <!-- 响应式网格布局 -->
    <div class="grid-container">
      <!-- 统计卡片 -->
      <div class="grid-section">
        <el-row :gutter="12">
          <el-col :xs="12" :sm="6" :md="6" v-for="(card, idx) in statCards" :key="idx">
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
      <div class="grid-section">
        <el-row :gutter="12">
          <el-col :xs="24" :sm="24" :md="16">
            <ChartCard :option="lineOption" height="320px" :lazy="false" :key="chartKey" />
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <ChartCard :option="pieOption" height="320px" :lazy="false" :key="chartKey" />
          </el-col>
        </el-row>
      </div>

      <!-- 中部：双轴折线 -->
      <div class="grid-section">
        <ChartCard :option="dualLineOption" height="340px" :lazy="false" :key="chartKey" />
      </div>

      <!-- 中部：漏斗图 -->
      <div class="grid-section">
        <ChartCard :option="funnelOption" height="340px" :lazy="false" :key="chartKey" />
      </div>

      <!-- 下半区：堆叠柱 + 普通柱 -->
      <div class="grid-section">
        <el-row :gutter="12">
          <el-col :xs="24" :sm="24" :md="14">
            <ChartCard :option="stackedBarOption" height="340px" :lazy="false" :key="chartKey" />
          </el-col>
          <el-col :xs="24" :sm="24" :md="10">
            <ChartCard :option="barOption" height="340px" :lazy="false" :key="chartKey" />
          </el-col>
        </el-row>
      </div>

      <!-- 表格 -->
      <div class="grid-section">
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
/* 主题变量已全局注入（assets/styles/theme.css），避免刷新样式回退与闪烁 */
</style>

<style scoped>
.dashboard {
  padding: 12px;
  height: 100%;
  background: var(--bg-page);
  color: var(--text-1);
  overflow: visible;
  display: flex;
  flex-direction: column;
}

/* 移动端响应式优化 */
@media (max-width: 768px) {
  .dashboard {
    padding: 8px;
    height: 100%;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .title h2 {
    font-size: 20px;
  }
  
  .title p {
    font-size: 12px;
  }
  
  .grid-container {
    gap: 16px;
  }
  
  .stat-card :deep(.el-card__body) {
    padding: 12px;
  }
  
  .stat .value {
    font-size: 20px;
  }
  
  .stat .trend {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 6px;
  }
  
  .grid-container {
    gap: 12px;
  }
  
  .stat-card {
    margin-bottom: 8px;
  }
  
  .title h2 {
    font-size: 18px;
  }
}

.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.title h2 {
  margin: 0 0 4px;
  font-size: 24px;
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
.grid-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: visible;
  min-height: 0;
}

.grid-section {
  width: 100%;
  flex-shrink: 0;
}

.stat-card :deep(.el-card__body) {
  padding: 16px;
}

.stat-card {
  background: var(--bg-card);
  border-color: var(--border);
  height: 100%;
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

.stat .label { 
  color: var(--text-2); 
  font-size: 14px;
}

.stat .value { 
  font-size: 24px; 
  font-weight: 700; 
}

.stat .trend { 
  color: #20C997; 
  font-size: 12px;
  text-align: right;
}

/* 图表卡片响应式优化 */
:deep(.chart-card) {
  background: var(--bg-card);
  border-color: var(--border);
  border-radius: 6px;
  overflow: hidden;
  height: 100%;
}

:deep(.chart-container) {
  width: 100%;
  height: 100%;
  min-height: 200px;
}

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

/* 移动端图表高度调整 */
@media (max-width: 768px) {
  :deep(.chart-card) {
    height: 280px;
  }
  
  .stat-card .stat {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 4px;
  }
  
  .stat .trend {
    text-align: center;
  }
}

@media (max-width: 480px) {
  :deep(.chart-card) {
    height: 240px;
  }
  
  .stat .value {
    font-size: 20px;
  }
  
  .stat .label {
    font-size: 12px;
  }
}

/* 确保Element Plus组件在小屏幕下正确换行 */
:deep(.el-col) {
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  :deep(.el-col) {
    margin-bottom: 16px;
  }
}
</style>