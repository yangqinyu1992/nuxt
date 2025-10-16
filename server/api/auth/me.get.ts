import { defineEventHandler, getCookie, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { User } from '../../models/User'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: '未登录' })
  }
  try {
    const decoded = verifyToken(token, config.jwtSecret)
    const user = await User.findById(decoded.uid)
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: '用户不存在' })
    }
    return { user: { id: user._id, username: user.username } }
  } catch {
    throw createError({ statusCode: 401, statusMessage: '无效令牌' })
  }
})