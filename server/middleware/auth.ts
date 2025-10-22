import { H3Event } from 'h3';
import jwt from 'jsonwebtoken';

// 定义扩展后的用户接口
interface UserPayload {
  uid: string;
  username: string;
}

// 扩展 H3EventContext
declare module 'h3' {
  interface H3EventContext {
    user?: UserPayload;
  }
}

// 获取 JWT 密钥的辅助函数
function getJwtSecret(event: H3Event): string {
  const config = useRuntimeConfig(event);
  return config.jwtSecret;
}

export default defineEventHandler(async (event) => {
  // 只保护以 /api/ 开头且不是 /api/auth/login 和 /api/auth/logout 的路由
  const isApiRoute = event.path.startsWith('/api/');
  const isLoginRoute = event.path.startsWith('/api/auth/login');
  const isRefreshRoute = event.path.startsWith('/api/auth/refresh');
  const isLogoutRoute = event.path.startsWith('/api/auth/logout');

  if (isApiRoute && !isLoginRoute && !isRefreshRoute && !isLogoutRoute) {
    const authHeader = getHeader(event, 'Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: No token provided',
      });
    }

    const token = authHeader.substring(7);

    try {
      const secret = getJwtSecret(event);
      const decoded = jwt.verify(token, secret) as UserPayload;
      event.context.user = decoded; // 将解码后的用户信息附加到事件上下文中
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid token',
      });
    }
  }
});
