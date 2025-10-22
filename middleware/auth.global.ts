/**
 * 全局登录校验（服务端 + 客户端）
 * - 解决刷新页面时 SSR 阶段未跳转的问题
 * - 页面可通过 definePageMeta({ auth: false }) 显式豁免
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // 仅在服务端执行（SSR 首屏）
  if (import.meta.client) return
  // 页面级显式豁免
  if (to.meta?.auth === false) return

  // 公共路由白名单
  const publicPaths = new Set([
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/',
  ])
  if (publicPaths.has(to.path)) return

  // 读取 accessToken（服务端与客户端均可读取）
  const accessToken = useCookie<string | null>('accessToken')

  if (!accessToken.value) {
    // 无 token，直接跳转登录
    return navigateTo('/login', { replace: true })
  }

  try {
    // 有 token，进一步向后端校验
    await $fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${accessToken.value}` },
    })
  } catch (e) {
    // token 失效或后端拒绝
    accessToken.value = null
    return navigateTo('/login', { replace: true })
  }
})