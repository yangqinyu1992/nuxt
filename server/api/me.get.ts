import { User } from '../models/User';

export default defineEventHandler(async (event) => {
  // 从事件上下文中获取用户信息，该信息由 auth 中间件设置
  const userPayload = event.context.user;

  if (!userPayload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  // 从数据库中查找完整的用户信息
  const user = await User.findById(userPayload.uid);

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    });
  }

  // 返回用户信息
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
  };
});
