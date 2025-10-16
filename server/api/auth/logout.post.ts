import { defineEventHandler, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  // 清除 token
  setCookie(event, 'token', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  })
  return { ok: true }
})