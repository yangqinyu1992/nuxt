import { useFetch, useCookie, navigateTo } from '#app';
import { watch } from 'vue';

export const useApi = (url: string, options: any = {}) => {
  const accessToken = useCookie('accessToken');

  const defaultOptions: any = {
    onRequest({ options }: any) {
      if (accessToken.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken.value}`,
        };
      }
    },
  };

  // 合并默认选项和传入选项
  const finalOptions = { server: false, ...defaultOptions, ...options };

  // 执行 useFetch（统一在客户端执行，避免 SSR 阶段 401 干扰跳转逻辑）
  const { data, error, pending, refresh } = useFetch(url, finalOptions);

  // 监听错误
  watch(error, async (newError) => {
    if (newError && newError.statusCode === 401) {
      // 尝试刷新 token
      try {
        const { accessToken: newAccessToken } = await $fetch('/api/auth/refresh', { method: 'POST' });
        accessToken.value = newAccessToken;
        
        // 刷新原始请求
        await refresh();
      } catch (refreshError) {
        // 如果刷新失败，则清除 token 并重定向到登录页面
        accessToken.value = null;
        navigateTo('/login', { replace: true });
      }
    }
  });

  return { data, error, pending, refresh };
};
