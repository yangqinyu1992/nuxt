import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { User } from '../../models/User'
import { verifyPassword, signToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { username, password } = body || {}

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: '用户名和密码必填' })
  }

  const user = await User.findOne({ username })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '账号或密码错误' })
  }

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: '账号或密码错误' })
  }

  const token = signToken({ uid: user._id, username }, config.jwtSecret)
  setCookie(event, 'token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 3600
  })

  return { user: { id: user._id, username: user.username } }
})