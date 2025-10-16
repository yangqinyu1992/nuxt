import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: object, secret: string, expiresIn = '7d') {
  return jwt.sign(payload, secret, { expiresIn })
}

export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret) as any
}