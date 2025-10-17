import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    'element-plus/dist/index.css',
    'element-plus/theme-chalk/dark/css-vars.css',
    '@/assets/styles/theme.css',
    '@/assets/styles/design-flat.css'
  ],
  app: {
    head: {
      title: 'Nuxt + ElementPlus Demo',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]
    }
  },
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nuxt_auth',
    jwtSecret: process.env.JWT_SECRET || 'nuxt-elementplus-secret',
    public: {}
  },
  nitro: {
    compatibilityDate: '2025-10-16'
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
    compressPublicAssets: true
  },
  features: {
    inlineStyles: false
  }
})