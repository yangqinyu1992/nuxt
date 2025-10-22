import { defineEventHandler, getRouterParam, getCookie, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { User } from '../../models/User'
import { verifyToken } from '../../utils/auth'
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


  const id = String(getRouterParam(event, 'id') ?? '')
  if (!id || !mongoose.isValidObjectId(id)) {
    throw safeCreateError({ statusCode: 400, statusMessage: '无效ID', message: '无效ID' })
  }
  const u = await User.findById(id).lean()
  if (!u) throw safeCreateError({ statusCode: 404, statusMessage: '用户不存在', message: '用户不存在' })
  return { id: String(u._id), username: u.username, name: u.name || '', avatar: u.avatar || '', createdAt: u.createdAt }
})