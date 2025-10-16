import { defineEventHandler, readBody, createError } from 'h3'

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
  const body = await readBody(event)
  const { username, password } = body || {}

  // 示例校验：请替换为你的真实鉴权逻辑
  if (username === 'admin' && password === '123456') {
    return {
      token: 'mock-token',
      user: { name: 'Admin', roles: ['admin'] },
    }
  }

  throw safeCreateError({ statusCode: 401, statusMessage: 'Invalid credentials', message: 'Invalid credentials' })
})