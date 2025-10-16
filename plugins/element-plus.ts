import { defineNuxtPlugin } from 'nuxt/app'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus)
  for (const [key, component] of Object.entries(ElIconModules)) {
    // 全量注册图标组件，方便直接使用
    nuxtApp.vueApp.component(key, component as any)
  }
})