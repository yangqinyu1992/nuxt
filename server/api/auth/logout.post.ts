export default defineEventHandler((event) => {
  // 清除名为 'token' 的 cookie
  setCookie(event, 'token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: -1, // 设置 maxAge 为 -1 或 0 来立即删除 cookie
    path: '/',
  });

  // 如果您使用了 refresh token，也要一并清除
  setCookie(event, 'refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: -1,
    path: '/',
  });

  // 同步清除前端持有的 accessToken（非 HttpOnly）
  setCookie(event, 'accessToken', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: -1,
    path: '/',
  });

  return { message: 'Logout successful' };
});
