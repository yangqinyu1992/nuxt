import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { User } from '../../models/User'
import { hashPassword, signToken } from '../../utils/auth'

function safeCreateError(i: any) {
  if (typeof i === 'string') {
    return createError({ statusCode: 500, statusMessage: i, message: i })
  }
  if (i && typeof i === 'object') {
    const code = (i as any).statusCode ?? 500
    const msg = (i as any).message ?? (i as any).statusMessage ?? '服务器错误'
    return createError({ statusCode: code, statusMessage: msg, message: msg })
  }
  return createError({ statusCode: 500, statusMessage: '服务器错误', message: '服务器错误' })
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { username, password, name = '', avatar = '' } = body || {}

  if (!username || !password) {
    throw safeCreateError({ statusCode: 400, statusMessage: '用户名和密码必填', message: '用户名和密码必填' })
  }

  const exists = await User.findOne({ username })
  if (exists) {
    throw safeCreateError({ statusCode: 409, statusMessage: '用户名已存在', message: '用户名已存在' })
  }

  const passwordHash = await hashPassword(password)
  const user = await User.create({ username, passwordHash, name, avatar })

  const token = signToken({ uid: user._id, username }, config.jwtSecret)
  setCookie(event, 'token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 3600
  })

  return { user: { id: user._id, username: user.username, name: user.name || '', avatar: user.avatar || '' } }
})