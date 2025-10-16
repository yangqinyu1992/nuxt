import { defineEventHandler, readBody, getRouterParam, getCookie, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { User } from '../../models/User'
import { verifyToken, hashPassword } from '../../utils/auth'
import mongoose from 'mongoose'

function safeCreateError(i: any) {
  if (typeof i === 'string') return createError({ statusCode: 500, statusMessage: i, message: i })
  if (i && typeof i === 'object') {
    const code = (i as any).statusCode ?? 500
    const msg = (i as any).message ?? (i as any).statusMessage ?? '服务器错误'
    return createError({ statusCode: code, statusMessage: msg, message: msg })
  }
  return createError({ statusCode: 500, statusMessage: '服务器错误', message: '服务器错误' })
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'token')
  if (!token) throw safeCreateError({ statusCode: 401, statusMessage: '未登录', message: '未登录' })
  try {
    verifyToken(token, config.jwtSecret)
  } catch {
    throw safeCreateError({ statusCode: 401, statusMessage: '无效令牌', message: '无效令牌' })
  }

  const id = String(getRouterParam(event, 'id') ?? '')
  if (!id || !mongoose.isValidObjectId(id)) {
    throw safeCreateError({ statusCode: 400, statusMessage: '无效ID', message: '无效ID' })
  }

  const body = await readBody(event)
  const patch: any = {}
  if (typeof body?.name === 'string') patch.name = body.name.trim()
  if (typeof body?.avatar === 'string') patch.avatar = body.avatar.trim()
  if (typeof body?.password === 'string' && body.password.trim()) {
    patch.passwordHash = await hashPassword(body.password.trim())
  }

  const ret = await User.findByIdAndUpdate(id, { $set: patch }, { new: true })
  if (!ret) throw safeCreateError({ statusCode: 404, statusMessage: '用户不存在', message: '用户不存在' })
  return { id: String(ret._id), username: ret.username, name: ret.name || '', avatar: ret.avatar || '', createdAt: ret.createdAt }
})