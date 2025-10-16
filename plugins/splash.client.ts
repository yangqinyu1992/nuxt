import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return
  const hide = () => {
    const el = document.getElementById('app-splash')
    if (!el) return
    el.classList.add('hide')
    // 动画结束后移除
    setTimeout(() => {
      try { el.parentElement?.removeChild(el) } catch {}
    }, 300)
  }
  // 应用挂载后隐藏
  nuxtApp.hooks.hook('app:mounted', hide)
  // 保险：页面完全加载也隐藏（某些极端情况下）
  window.addEventListener('load', hide, { once: true })
})