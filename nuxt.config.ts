import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    'element-plus/dist/index.css',
    'element-plus/theme-chalk/dark/css-vars.css',
    '@/assets/styles/theme.css'
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
    inlineSSRStyles: true
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            echarts: ['echarts/core', 'echarts/charts', 'echarts/renderers', 'echarts/components'],
            'vue-echarts': ['vue-echarts']
          }
        }
      }
    }
  }
})