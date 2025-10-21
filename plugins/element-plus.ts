
import ElementPlus from 'element-plus'

// 只引入实际使用的图标
import {
  HomeFilled,
  Fold,
  Expand,
  User,
  Setting,
  FullScreen,
  Refresh,
  SwitchButton,
  Expand as ExpandIcon,
  Fold as FoldIcon
} from '@element-plus/icons-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus, {
    zIndex: 2000 // 设置z-index基础值，避免注入警告
  })
  
  // 按需注册图标组件
  const icons = {
    HomeFilled,
    Fold,
    Expand,
    User,
    Setting,
    FullScreen,
    Refresh,
    SwitchButton,
    ExpandIcon,
    FoldIcon
  }
  
  Object.entries(icons).forEach(([key, component]) => {
    nuxtApp.vueApp.component(key, component)
  })
})