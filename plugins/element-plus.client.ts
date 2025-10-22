import ElementPlus from 'element-plus'
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
  nuxtApp.vueApp.use(ElementPlus)
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