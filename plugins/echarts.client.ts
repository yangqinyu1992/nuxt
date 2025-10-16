import { defineNuxtPlugin } from 'nuxt/app'
import VChart from 'vue-echarts'

// ECharts v6 按需引入核心与组件
import { use } from 'echarts/core'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart,
  LineChart,
  PieChart,
  FunnelChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent,
  ToolboxComponent,
  DataZoomComponent,
  BrushComponent
} from 'echarts/components'

// 注册所需组件
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  FunnelChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent,
  ToolboxComponent,
  DataZoomComponent,
  BrushComponent
])

export default defineNuxtPlugin((nuxtApp) => {
  // 全局注册 v-chart 组件（vue-echarts 使用默认导入）
  nuxtApp.vueApp.component('v-chart', VChart)
})