import { defineEventHandler, readBody, createError } from 'h3'

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

  throw createError({
    statusCode: 401,
    statusMessage: 'Invalid credentials',
  })
})