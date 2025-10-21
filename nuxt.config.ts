import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    'element-plus/dist/index.css',
    'element-plus/theme-chalk/dark/css-vars.css',
    '@/assets/styles/theme.css',
    '@/assets/styles/design-flat.css'
  ],
  runtimeConfig: {
    mongodbUri: 'mongodb://root:123456@47.120.13.248:27018/admin?authSource=admin', // 更改端口为您的目标MongoDB实例的端口，并确认认证信息正确
    jwtSecret: process.env.JWT_SECRET || 'nuxt-elementplus-secret',
    public: {}
  },
  experimental: {
    renderJsonPayloads: true,
    payloadExtraction: true,
    inlineSSRStyles: false
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 800
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/variables.scss";'
        }
      }
    }
  },
  app: {
    head: {
      title: 'Nuxt + ElementPlus Demo',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '高性能的Nuxt + ElementPlus管理后台' }
      ],
      link: [
        { rel: 'preload', href: '/_nuxt/element-plus.css', as: 'style' },
        { rel: 'preload', href: '/_nuxt/entry.css', as: 'style' }
      ]
    }
  },
  nitro: {
    compatibilityDate: '2025-10-16',
    minify: true,
    compressPublicAssets: true,
    devProxy: {
      '/upload_proxy': {
        target: 'http://47.120.13.248:3000',
        changeOrigin: true,
        prependPath: true,
      },
    },
  },
  features: {
    inlineStyles: false
  }
})