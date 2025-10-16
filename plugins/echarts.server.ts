import { defineNuxtPlugin } from 'nuxt/app'
import { defineComponent, h } from 'vue'

// 在服务端注册一个占位组件，避免 SSR 阶段解析 v-chart 报警告
export default defineNuxtPlugin((nuxtApp) => {
  const Stub = defineComponent({
    name: 'VChartStub',
    render() {
      return h('div') // 占位，不输出图表
    }
  })
  nuxtApp.vueApp.component('v-chart', Stub)
})