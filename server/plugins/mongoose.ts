import mongoose from 'mongoose'
import { useRuntimeConfig } from '#imports'

declare global {
  // 防止热更新重复连接
  // eslint-disable-next-line no-var
  var __mongooseConn: Promise<typeof mongoose> | undefined
}

// Nitro 会自动执行 server/plugins 下的默认导出函数
export default async () => {
  const config = useRuntimeConfig()
  if (!globalThis.__mongooseConn) {
    globalThis.__mongooseConn = mongoose.connect(config.mongodbUri).then((conn) => {
      console.log('[DB] Connected:', config.mongodbUri)
      return conn
    }).catch((err) => {
      console.error('[DB] Connection error:', err)
      throw err
    })
  }
  await globalThis.__mongooseConn
}