<template>
  <el-config-provider :z-index="3000">
    <el-container :class="['app-layout', 'design-flat', densityClass]" ref="containerRef">
    <!-- 左右结构：左侧菜单 + 右侧（顶部栏 + 内容） -->
    <el-aside class="app-aside" :class="{ 'is-collapsed': isCollapsed }" :width="asideWidth">
      <div class="aside-brand">
        <img class="logo" :src="logo" alt="Nuxt Admin" />
        <span class="brand-text">Nuxt Admin</span>
      </div>
      <el-scrollbar>
        <el-menu :default-active="activePath" router :collapse="isCollapsed">
          <el-menu-item index="/home"><el-icon><HomeFilled /></el-icon><span>仪表盘</span></el-menu-item>
          <el-menu-item index="/profile"><el-icon><User /></el-icon><span>个人资料</span></el-menu-item>
          <!-- 预留：可继续添加菜单 -->
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container class="content-wrap" direction="vertical">
      <el-header class="app-header" height="56px">
        <div class="header-left">
          <el-button text circle class="collapse-btn" @click="toggleAside" :title="isCollapsed ? '展开侧边栏' : '折叠侧边栏'">
            <el-icon><component :is="isCollapsed ? 'Expand' : 'Fold'" /></el-icon>
          </el-button>
        </div>
        <div class="header-right">
          <!-- 全屏 -->
          <el-tooltip placement="bottom" :content="isFullscreen ? '退出全屏' : '全屏显示'">
            <el-button text circle @click="toggleFullscreen" class="icon-btn">
              <el-icon><FullScreen /></el-icon>
            </el-button>
          </el-tooltip>
          <!-- 刷新数据 -->
          <div class="tip-wrap">
            <el-tooltip placement="bottom" content="刷新数据" :teleported="false" popper-class="nowrap-tooltip">
              <el-button text circle @click="refreshData" class="icon-btn">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </el-tooltip>
          </div>


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
          <!-- 用户头像下拉 -->
          <el-dropdown trigger="click" placement="bottom-end" popper-class="user-dropdown" @command="onUserCommand">
            <span class="el-dropdown-link" style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;">
              <el-avatar :size="32" :src="userAvatar || ''" @error="onAvatarError">{{ initials }}</el-avatar>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <el-avatar :size="22" :src="userAvatar" />
                    <span>{{ userName }}</span>
                  </div>
                </el-dropdown-item>

                <el-dropdown-item command="edit">修改用户信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="app-main">
        <div class="tabs">
          <el-tabs v-model="activePath" type="card" @tab-click="onTabClick" @tab-remove="onTabRemove" closable>
            <el-tab-pane v-for="t in tabs" :key="t.path" :name="t.path" :label="t.title" :closable="t.path !== '/home'"></el-tab-pane>
          </el-tabs>
        </div>
        <slot />
      </el-main>
    </el-container>
    <!-- 修改用户信息弹窗 -->
    <el-dialog v-model="editDialogVisible" title="修改用户信息" width="420px">
      <el-form label-width="88px">
        <el-form-item label="头像地址">
          <el-input v-model="editForm.avatar" placeholder="http(s):// 或 data:image/..."></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" maxlength="20" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeFilled, Fold, Expand, ArrowRight, User, Setting, FullScreen, Refresh, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import logo from '~/assets/logo.svg?url'

const route = useRoute()
const router = useRouter()
const containerRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

// 用户信息与编辑弹窗
const userName = ref('管理员')
const userAvatar = ref(logo) // 默认用当前 logo 作为占位头像
const editDialogVisible = ref(false)
const editForm = ref({ avatar: '', nickname: '' })

// 头像占位（首字母）与加载失败回退
const initials = computed(() => (userName.value?.trim()?.charAt(0) || 'U').toUpperCase())
const onAvatarError = () => {
  userAvatar.value = ''
  return false
}

// 拉取当前用户信息
const loadUser = async () => {
  try {
    const { data, error } = await useFetch('/api/users/me', { server: false })
    if (!error.value && data.value) {
      userName.value = (data.value.name || userName.value)
      userAvatar.value = (data.value.avatar || userAvatar.value)
    }
  } catch {}
}

const onUserCommand = (cmd: string) => {
  if (cmd === 'profile') {
    router.push('/profile')
  } else if (cmd === 'edit') {
    // 打开编辑弹窗并填充当前值
    editForm.value.avatar = userAvatar.value || ''
    editForm.value.nickname = userName.value || ''
    editDialogVisible.value = true
  } else if (cmd === 'logout') {
    logout()
  }
}

const isValidAvatar = (v: string) => {
  if (!v) return true
  if (v.includes('@')) return false
  return /^https?:\/\//i.test(v) || /^data:image\//i.test(v)
}
const submitEdit = async () => {
  // 简单校验
  if (!editForm.value.nickname?.trim()) {
    ElMessage.error('请填写昵称')
    return
  }
  if (!isValidAvatar(editForm.value.avatar)) {
    ElMessage.error('头像需为 http/https 或 data:image/，且不能是邮箱')
    return
  }
  try {
    const response = await $fetch('/api/users/me', {
      method: 'post',
      body: {
        avatar: editForm.value.avatar?.trim() || null,
        name: editForm.value.nickname.trim()
      }
    })
    const updated: any = response || {}
    userName.value = (updated.nickname ?? editForm.value.nickname.trim())
    userAvatar.value = (updated.avatar ?? (editForm.value.avatar?.trim() || userAvatar.value))
    editDialogVisible.value = false
    ElMessage.success('已更新用户信息')
  } catch {
    ElMessage.error('保存失败，请重试')
  }
}

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

  // 监听全屏变更
  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', onFullscreenChange)
    isFullscreen.value = !!document.fullscreenElement
  }

  // 恢复密度设置
  try {
    const savedDensity = localStorage.getItem(DENSITY_KEY) as any
    if (savedDensity === 'compact' || savedDensity === 'standard' || savedDensity === 'comfortable') {
      density.value = savedDensity
    }
  } catch {}
})
onMounted(() => { loadUser() })
const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}
onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('fullscreenchange', onFullscreenChange)
  }
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

// 全屏控制
const enterFullscreen = async () => {
  const el: any = containerRef.value || document.documentElement
  if (!document.fullscreenElement && el && typeof el.requestFullscreen === 'function') {
    await el.requestFullscreen()
  } else if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
  }
}
const exitFullscreen = async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen()
  }
}
const toggleFullscreen = async () => {
  if (document.fullscreenElement) {
    await exitFullscreen()
  } else {
    await enterFullscreen()
  }
}

// 刷新数据
const refreshData = async () => {
  try {
    if (route.path.startsWith('/profile')) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('refresh-profile'))
      }
    } else {
      await refreshNuxtData(route.fullPath)
    }
    ElMessage.success('数据已刷新')
  } catch {
    ElMessage.error('刷新失败')
  }
}

// 退出登录
const logout = async () => {
  const { error } = await useFetch('/api/auth/logout', { method: 'POST', server: false })
  if (error.value) {
    ElMessage.error('退出失败，请重试')
    return
  }
  ElMessage.success('已退出登录')
  navigateTo('/login')
}

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



/* 移动端响应式布局 */
@media (max-width: 992px) {
  .app-aside {
    position: fixed !important;
    z-index: 1000;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .app-aside.is-collapsed {
    transform: translateX(-100%);
  }
  
  .app-aside:not(.is-collapsed) {
    transform: translateX(0);
  }
  
  .content-wrap {
    margin-left: 0 !important;
    width: 100% !important;
  }
  
  .app-header {
    padding: 0 8px;
  }
  
  .header-right {
    gap: 4px;
  }
  
  .header-right .icon-btn {
    width: 28px;
    height: 28px;
  }
  
  .collapse-btn {
    position: fixed;
    left: 8px;
    top: 8px;
    z-index: 1001;
    background: var(--bg-card);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
}

@media (max-width: 768px) {
  .app-header {
    height: 48px !important;
    padding: 0 6px;
  }
  
  .header-right {
    gap: 2px;
  }
  
  .tabs {
    margin-left: -8px;
    margin-right: -8px;
  }
  
  .tabs .el-tabs__item {
    padding: 0 6px;
    font-size: 12px;
  }
  
  .app-main {
    padding: 0 8px 8px;
  }
}

@media (max-width: 480px) {
  .header-right .el-button:not(.icon-btn) {
    display: none;
  }
  
  .brand-text {
    display: none;
  }
  
  .tabs .el-tabs__nav-scroll {
    padding: 0 4px;
  }
}
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: 0 1px 2px rgba(0,0,0,.04);
  padding: 0 12px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
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
  overflow: hidden; /* 禁止外层滚动，滚动只在内部菜单区域发生 */
}
.app-main {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 16px 16px; /* 顶部0，让 Tabs 贴在 el-main 内部顶部 */
  background: var(--bg-page);
  display: flex;
  flex-direction: column;
}

.app-main > .tabs {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  margin: 0 -16px;
  padding: 0 16px;
}

.app-main > :not(.tabs) {
  flex: 1;
  min-height: 0;
  overflow: visible;
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
  line-height: 32px;
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
/* 修复图标按钮悬停抖动与对齐 */
.header-right .icon-btn {
  width: 32px; /* 固定宽度，避免悬停抖动 */
}





/* Logo 尺寸与对齐 */
.brand .logo {
  height: 24px;
  width: auto;
  display: block;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.brand .brand-text {
  line-height: 1;
}

/* 头像与下拉轻量样式 */
.header-right :deep(.el-dropdown-menu__item.is-disabled) {
  opacity: .9;
  cursor: default;
}
/* 右侧容器：防止内容区域在极端宽度下被挤压换行 */
.content-wrap { flex: 1; min-width: 0; }

/* 让 Tooltip 的引用元素拥有稳定定位上下文 */
.tip-wrap { position: relative; display: inline-block; }

/* 侧边栏品牌区 */
.aside-brand {
  height: 56px; /* 与顶部栏一致 */
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text-1);
  background: var(--bg-card);
  box-sizing: border-box;
}
.app-aside.is-collapsed .aside-brand {
  justify-content: center;
  padding: 0; /* 收缩时图标居中 */
  width: 64px; /* 与折叠侧边栏宽度一致，保证与菜单图标水平对齐 */
}

/* 侧边栏菜单滚动区域扣除品牌区高度，仅菜单可滚动 */
.app-aside .el-scrollbar {
  height: calc(100% - 56px);
}
.app-aside .aside-brand .logo {
  height: 24px;
  width: auto;
  display: block;
}
.app-aside.is-collapsed .aside-brand .logo {
  height: 20px; /* 折叠时使用与菜单图标接近的尺寸，位置与观感一致 */
}
.app-aside.is-collapsed .aside-brand .brand-text {
  display: none; /* 收缩仅显示图标 */
}

/* 移除菜单默认右侧边框，避免与侧边栏边框叠加变深 */
.app-aside .el-menu {
  border-right: none;
  border-left: none;
  border-top: none;
  border-bottom: none;
}

</style>

<style>
/* 用户头像下拉菜单样式 */
.user-dropdown {
  min-width: 160px;
  padding: 4px 0;
}
.user-dropdown .el-dropdown-menu__item {
  line-height: 28px;
}
</style>

<style>
/* Tooltip 不换行，避免一字一行 */
.nowrap-tooltip {
  white-space: nowrap;
  word-break: keep-all;
}
</style>

<style>
/* 额外样式（未 scoped）以便 Tabs 适配主题 */
.tabs .el-tabs__item {
  color: var(--text-1);
}
.tabs .el-tabs__nav-scroll {
  background: var(--bg-card); /* 使用系统卡片背景色 */
  border-bottom: none; /* 去掉底部分割线 */
  padding: 0 10px;     /* 将左右留白移到内部滚动容器 */
}

/* Tabs 统一内外边距与高度 + 粘性置顶（贴紧左右） */
.tabs {
  margin-left: -16px;  /* 抵消 el-main 左侧 16px 内边距 */
  margin-right: -16px; /* 抵消 el-main 右侧 16px 内边距 */
  padding: 0;          /* 容器本身贴紧边缘 */
  position: sticky;    /* 预设B：粘性置顶 */
  /* 去掉 top 偏移 */
  z-index: 5;          /* 保证覆盖内容区域 */
  background: var(--bg-card);    /* 使用系统卡片背景色 */
}
.tabs .el-tabs__header {
  margin: 0;
}
/* 去除分隔线/边框，激活项用颜色与圆角区分 */
.tabs .el-tabs__nav-wrap::after { display: none; }
.tabs .el-tabs__header { margin: 0; border-bottom: none; }
.tabs .el-tabs--card > .el-tabs__header .el-tabs__nav { border: none; }
.tabs .el-tabs--card > .el-tabs__header .el-tabs__item { border: none; }
.tabs .el-tabs__item {
  height: 32px;
  line-height: 32px;
  padding: 0 10px;          /* 更紧凑的左右内边距 */
  font-size: 13px;          /* 贴近截图的字号 */
  border: none;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;                 /* 项内元素间距更紧 */
  transition: background .15s ease, color .15s ease;
}
.tabs .el-tabs__item.is-active {
  color: var(--el-color-primary);
  background: rgba(64,158,255,.12); /* 激活背景透明度 0.12 */
  border-radius: 8px;               /* 预设A：激活圆角8px */
  font-weight: 600;                 /* 激活项加粗 */
}

/* 非激活项轻微 hover 背景 */
.tabs .el-tabs__item:not(.is-active):hover {
  background: rgba(64,158,255,.06);
}

/* 关闭按钮对齐与交互反馈 */
.tabs .el-tabs__item .el-icon-close {
  margin-left: 6px;
  font-size: 12px;  /* 更小的关闭图标，贴近紧凑风格 */
  color: var(--text-2);
}
.tabs .el-tabs__item .el-icon-close:hover {
  color: var(--el-color-primary);
}

.tabs .el-tabs__nav { display: flex; align-items: center; height: 100%; gap: 0; }
.tabs .el-tabs__header,
.tabs .el-tabs__nav-wrap,
.tabs .el-tabs__nav-scroll {
  height: 40px;    /* 还原为 40px */
  display: flex;
  align-items: center;
}
.tabs .el-tabs__item .el-icon, .tabs .el-tabs__item .el-icon-close { display: inline-flex; align-items: center; }
/* 移动端适配 */
@media (max-width: 768px) {
  .tabs { padding: 0; }
  .tabs .el-tabs__item { padding: 0 8px; }
}
</style>