

/**
 * 全局登录校验（客户端）
 * - 默认拦截所有页面
 * - 页面可通过 definePageMeta({ auth: false }) 显式豁免
 * - 预设公共路由白名单
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // 仅在客户端执行，避免 SSR 阶段请求/重定向引发报错
  if (import.meta.server) return

  // 跳过客户端首轮 hydration 阶段的校验，避免与服务端重复
  const hydratedOnce = useState<boolean>('__auth_hydrated_once__', () => false)
  if (!hydratedOnce.value) {
    hydratedOnce.value = true
    return
  }

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
    // 使用 accessToken 进行校验，避免不必要的 401
    const accessToken = useCookie('accessToken')
    await $fetch('/api/auth/me', {
      headers: accessToken.value ? { Authorization: `Bearer ${accessToken.value}` } : undefined,
    })
  } catch {
    return navigateTo('/login', { replace: true })
  }
})