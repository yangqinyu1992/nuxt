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
    mongodbUri: process.env.MONGO_URI || `mongodb://${process.env.MONGO_ROOT_USER || 'root'}:${process.env.MONGO_ROOT_PASS || '123456'}@mongo:27017/${process.env.MONGO_DB_NAME || 'nuxt_ep_app'}?authSource=admin`,
    jwtSecret: process.env.JWT_SECRET || 'nuxt-elementplus-secret',
    public: {}
  },
  experimental: {
    renderJsonPayloads: true,
    payloadExtraction: true,
    inlineSSRStyles: false
  },
  vite: {
    resolve: {
      alias: {
        '@popperjs/core': '@sxzz/popperjs-es'
      }
    },
    ssr: {
      noExternal: ['element-plus', '@sxzz/popperjs-es'],
      external: ['echarts', 'vue-echarts']
    },
    build: {
      chunkSizeWarningLimit: 1200,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/element-plus')) return 'vendor-element-plus'
            if (id.includes('node_modules/@sxzz/popperjs-es')) return 'vendor-popper'
            if (id.includes('node_modules/echarts/core')) return 'vendor-echarts-core'
            if (id.includes('node_modules/echarts/renderers')) return 'vendor-echarts-renderers'
            if (id.includes('node_modules/echarts/charts')) return 'vendor-echarts-charts'
            if (id.includes('node_modules/echarts/components')) return 'vendor-echarts-components'
            if (id.includes('node_modules/vue-echarts')) return 'vendor-vue-echarts'
            if (id.includes('node_modules/mongoose')) return 'vendor-db'
            if (id.includes('node_modules/moment')) return 'vendor-moment'
            if (id.includes('node_modules/jsonwebtoken')) return 'vendor-jwt'
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/variables.scss";'
        }
      }
    }
  },
  build: {
    transpile: ['element-plus', '@sxzz/popperjs-es']
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
    minify: false,
    compressPublicAssets: true,
    rollupConfig: {
      plugins: [],
      resolve: {
        alias: {
          '@popperjs/core': '@sxzz/popperjs-es'
        }
      }
    },
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