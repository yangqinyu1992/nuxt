import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { User } from '../../models/User'
import { verifyToken, hashPassword } from '../../utils/auth'

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


  const body = await readBody(event)
  const username = String(body?.username ?? '').trim()
  const password = String(body?.password ?? '').trim()
  const name = String(body?.name ?? '').trim()
  const avatar = String(body?.avatar ?? '').trim()

  if (!username || !password) {
    throw safeCreateError({ statusCode: 400, statusMessage: '用户名和密码必填', message: '用户名和密码必填' })
  }
  const exists = await User.findOne({ username })
  if (exists) {
    throw safeCreateError({ statusCode: 409, statusMessage: '用户名已存在', message: '用户名已存在' })
  }
  const passwordHash = await hashPassword(password)
  const created = await User.create({ username, passwordHash, name, avatar })
  return {
    id: String(created._id),
    username: created.username,
    name: created.name || '',
    avatar: created.avatar || '',
    createdAt: created.createdAt
  }
})