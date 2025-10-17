

/**
 * 全局登录校验（客户端）
 * - 默认拦截所有页面
 * - 页面可通过 definePageMeta({ auth: false }) 显式豁免
 * - 预设公共路由白名单
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // 仅在客户端执行，避免 SSR 阶段请求/重定向引发报错
  if (import.meta.server) return

  // 页面级显式豁免：definePageMeta({ auth: false })
  if (to.meta?.auth === false) return

  // 公共路由白名单（可按需增减）
  const publicPaths = new Set([
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/', // 首页如需也保护，可移除
  ])
  if (publicPaths.has(to.path)) return

  try {
    // 统一使用客户端接口校验登录态
    // 若你的项目未定义 useClientFetch，可改成：await $fetch('/api/auth/me')
    await useClientFetch('/api/auth/me')
  } catch {
    return navigateTo('/login', { replace: true })
  }
})