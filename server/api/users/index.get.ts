import { defineEventHandler, getQuery, getCookie, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { User } from '../../models/User'
import { verifyToken } from '../../utils/auth'

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

  const q = getQuery(event)
  const page = Math.max(parseInt(String(q.page ?? '1'), 10) || 1, 1)
  const pageSize = Math.min(Math.max(parseInt(String(q.pageSize ?? '10'), 10) || 10, 1), 100)
  const keyword = String(q.keyword ?? '').trim()

  const filter: any = {}
  if (keyword) {
    filter.$or = [
      { username: { $regex: keyword, $options: 'i' } },
      { name: { $regex: keyword, $options: 'i' } }
    ]
  }

  const total = await User.countDocuments(filter)
  const list = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean()

  const items = list.map((u: any) => ({
    id: String(u._id),
    username: u.username,
    name: u.name || '',
    avatar: u.avatar || '',
    createdAt: u.createdAt
  }))

  return { items, total, page, pageSize }
})