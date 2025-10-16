<template>
  <el-container :class="['app-layout', 'design-flat', densityClass]">
    <el-header class="app-header" height="56px">
      <div class="header-left">
        <el-button text circle class="collapse-btn" @click="toggleAside" :title="isCollapsed ? '展开侧边栏' : '折叠侧边栏'">
          <el-icon><component :is="isCollapsed ? 'Expand' : 'Fold'" /></el-icon>
        </el-button>
        <div class="brand">Nuxt Admin</div>
        <el-breadcrumb class="app-breadcrumb" :separator-icon="ArrowRight">
          <el-breadcrumb-item
            v-for="(bc, idx) in breadcrumbItems"
            :key="idx"
            :to="bc.to"
            v-bind="bc.to ? { to: bc.to } : {}"
          >
            <span class="bc-pill">
              <el-icon v-if="idx === 0 && bc.to === '/home'" class="bc-icon"><HomeFilled /></el-icon>
              <span class="bc-text" :title="bc.title">{{ bc.title }}</span>
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-right">
        <el-popover placement="bottom-end" trigger="click" width="260">
          <template #reference>
            <el-button text circle :title="'偏好设置'">
              <el-icon><Setting /></el-icon>
            </el-button>
          </template>
          <div class="pref-row">
            <span>主题模式</span>
            <el-switch
              v-model="isDark"
              active-text="暗色"
              inactive-text="明亮"
              @change="toggleTheme"
            />
          </div>
          <div class="pref-row">
            <span>表格密度</span>
            <el-radio-group v-model="density" size="small">
              <el-radio-button label="compact">紧凑</el-radio-button>
              <el-radio-button label="standard">标准</el-radio-button>
              <el-radio-button label="comfortable">宽松</el-radio-button>
            </el-radio-group>
          </div>
        </el-popover>
        <el-divider direction="vertical" />
        <el-button link @click="goHome">仪表盘</el-button>
      </div>
    </el-header>

    <el-container class="app-body">
      <el-aside class="app-aside" :width="asideWidth">
        <el-scrollbar>
          <el-menu :default-active="activePath" router :collapse="isCollapsed">
            <el-menu-item index="/home"><el-icon><HomeFilled /></el-icon><span>仪表盘</span></el-menu-item>
            <el-menu-item index="/profile"><el-icon><User /></el-icon><span>个人资料</span></el-menu-item>
            <!-- 预留：可继续添加菜单 -->
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-main class="app-main">
        <div class="tabs">
          <el-tabs v-model="activePath" type="card" @tab-click="onTabClick" @tab-remove="onTabRemove" closable>
            <el-tab-pane v-for="t in tabs" :key="t.path" :name="t.path" :label="t.title" :closable="t.path !== '/home'"></el-tab-pane>
          </el-tabs>
        </div>
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeFilled, Fold, Expand, ArrowRight, User, Setting } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activePath = ref(route.path)
const THEME_KEY = 'dashboard_theme'
const ASIDE_COLLAPSE_KEY = 'aside_collapse'
const TABS_KEY = 'route_tabs'
const DENSITY_KEY = 'ui_density'
const isDark = ref(false)
const isCollapsed = ref(false)
const density = ref<'compact' | 'standard' | 'comfortable'>('standard')
const densityClass = computed(() => `df-density-${density.value}`)
const asideWidth = computed(() => (isCollapsed.value ? '64px' : '200px'))

const breadcrumbItems = computed(() => {
  const matched = route.matched.filter(r => r.path && r.path !== '/')
  const items = matched.map(r => ({
    title: (r.meta?.title as string) || (r.name as string) || '未命名',
    to: r.path !== route.path ? r.path : undefined
  }))
  return items.length ? items : [{ title: '首页', to: '/home' }]
})

const applyTheme = (dark: boolean) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    root.setAttribute('data-theme', dark ? 'dark' : 'light')
    // 激活 Element Plus 暗色变量（dark/css-vars.css 依赖 .dark）
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
  }
}
onMounted(() => {
  const saved = localStorage.getItem(THEME_KEY)
  isDark.value = saved ? saved === 'dark' : false
  applyTheme(isDark.value)

  const savedCollapse = localStorage.getItem(ASIDE_COLLAPSE_KEY)
  isCollapsed.value = savedCollapse ? savedCollapse === '1' : false

  // 小屏自动折叠
  if (typeof window !== 'undefined') {
    const mql = window.matchMedia('(max-width: 992px)')
    const apply = () => {
      if (mql.matches) isCollapsed.value = true
    }
    apply()
    mql.addEventListener?.('change', apply)
  }

  // 初始化页签
  restoreTabs()
  ensureTab(route)

  // 恢复密度设置
  try {
    const savedDensity = localStorage.getItem(DENSITY_KEY) as any
    if (savedDensity === 'compact' || savedDensity === 'standard' || savedDensity === 'comfortable') {
      density.value = savedDensity
    }
  } catch {}
})
const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
  applyTheme(isDark.value)
}

const toggleAside = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem(ASIDE_COLLAPSE_KEY, isCollapsed.value ? '1' : '0')
}

const goHome = () => router.push('/home')

// 页签状态
type Tab = { path: string; title: string }
const tabs = ref<Tab[]>([])

const ensureTab = (r: ReturnType<typeof useRoute>) => {
  const title = (r.meta?.title as string) || (r.name as string) || r.path
  if (!tabs.value.find(t => t.path === r.path)) {
    tabs.value.push({ path: r.path, title })
    persistTabs()
  }
  activePath.value = r.path
}
const persistTabs = () => {
  try { sessionStorage.setItem(TABS_KEY, JSON.stringify(tabs.value)) } catch {}
}
const restoreTabs = () => {
  try {
    const raw = sessionStorage.getItem(TABS_KEY)
    if (raw) tabs.value = JSON.parse(raw)
  } catch {}
}

watch(() => route.path, () => ensureTab(route))

// 持久化密度
watch(density, (val) => {
  try { localStorage.setItem(DENSITY_KEY, val) } catch {}
})

const onTabClick = (pane: any) => {
  if (pane?.paneName && pane.paneName !== route.path) router.push(pane.paneName as string)
}
const onTabRemove = (name: string) => {
  const idx = tabs.value.findIndex(t => t.path === name)
  if (idx >= 0) {
    const removedIsActive = name === route.path
    tabs.value.splice(idx, 1)
    persistTabs()
    if (removedIsActive) {
      const next = tabs.value[idx] || tabs.value[idx - 1] || { path: '/home' }
      router.push(next.path)
    }
  }
}
</script>

<style scoped>
.app-layout {
  position: fixed;
  inset: 0;
}
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.brand {
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  color: var(--text-1);
  background: rgba(64,158,255,.12);
}
.app-body {
  height: calc(100vh - 56px);
  overflow: hidden;
}
.app-aside {
  border-right: 1px solid var(--border);
  background: var(--bg-card);
}
.app-main {
  height: 100%;
  overflow: auto;
  padding: 12px;
  background: var(--bg-page);
}

/* 面包屑美化 */
.app-breadcrumb {
  --bc-bg: rgba(64,158,255,.08);
  --bc-hover: rgba(64,158,255,.16);
  --bc-text: var(--text-1);
}
.app-breadcrumb .el-breadcrumb__inner,
.app-breadcrumb .el-breadcrumb__inner a {
  color: var(--bc-text);
}
.app-breadcrumb .el-breadcrumb__item {
  line-height: 1;
}
.app-breadcrumb .el-breadcrumb__separator {
  margin: 0 6px;
  color: var(--text-2);
}
.bc-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 180px;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--bc-bg);
  transition: background .2s ease, color .2s ease;
}
.bc-pill:hover {
  background: var(--bc-hover);
}
.bc-icon {
  font-size: 14px;
  color: var(--text-2);
}
.bc-text {
  display: inline-block;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}
@media (max-width: 768px) {
  .bc-pill { max-width: 140px; padding: 6px 8px; }
  .bc-text { max-width: 110px; }
}
.pref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 2px;
}
.pref-row + .pref-row {
  border-top: 1px dashed var(--border, #eaecef);
  margin-top: 8px;
  padding-top: 12px;
}
</style>

<style>
/* 额外样式（未 scoped）以便 Tabs 适配主题 */
.tabs :deep(.el-tabs__item) {
  color: var(--text-1);
}
.tabs :deep(.el-tabs__nav-scroll) {
  background: var(--bg-card);
}
</style>