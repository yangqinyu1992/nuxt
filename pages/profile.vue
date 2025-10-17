<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, h, defineAsyncComponent } from 'vue'
import { ElMessage, ElMessageBox, ElButton, ElImage } from 'element-plus'

// 懒加载组件
const ConfigTable = defineAsyncComponent(() => import('~/components/ConfigTable.vue'))
const SearchForm = defineAsyncComponent(() => import('~/components/SearchForm.vue'))

definePageMeta({
  title: '个人资料'
})

interface UserListItem {
  id: string
  username: string
  name?: string
  avatar?: string
  createdAt: string | Date
}

const loading = ref(false)
const list = ref<UserListItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const keyword = ref('')

// 新建/编辑弹窗
const dialogVisible = ref(false)
const dialogTitle = ref<'新建用户' | '编辑用户'>('新建用户')
const editingId = ref<string | null>(null)
const form = ref({
  username: '',
  name: '',
  avatar: '',
  password: ''
})
const formLoading = ref(false)

// 搜索字段配置
const searchFields = [
  {
    type: 'input' as const,
    prop: 'keyword',
    label: '搜索',
    placeholder: '搜索用户名/昵称',
    width: '240px',
    clearable: true
  }
]

// 搜索按钮配置
const searchButtons = [
  {
    type: 'success' as const,
    text: '新建',
    icon: 'Plus'
  }
]

// 表格列配置
const tableColumns = [
  {
    prop: 'username',
    label: '用户名',
    minWidth: '140'
  },
  {
    prop: 'name',
    label: '昵称',
    minWidth: '120'
  },
  {
    label: '头像',
    minWidth: '160',
    render: (scope: any) => {
      const avatar = scope.row.avatar
      if (!avatar || !isImgUrl(avatar)) {
        return h('span', { class: 'text-gray-400' }, '-')
      }
      return h(ElImage, {
        class: 'avatar',
        src: avatar,
        previewSrcList: [avatar],
        hideOnClickModal: true
      })
    }
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    minWidth: '180'
  },
  {
    label: '操作',
    width: '180',
    fixed: 'right' as const,
    render: (scope: any) => {
      return h('div', { class: 'flex gap-2' }, [
        h(ElButton, {
          type: 'primary',
          size: 'small',
          onClick: () => openEdit(scope.row)
        }, '编辑'),
        h(ElButton, {
          type: 'danger',
          size: 'small',
          onClick: () => onDelete(scope.row)
        }, '删除')
      ])
    }
  }
]

// 判断是否为图片地址（http/https 或 data:image/）
function isImgUrl(u?: string) {
  if (!u) return false
  const s = u.trim()
  return /^https?:\/\/.+/i.test(s) || /^data:image\//i.test(s)
}

// 拉取列表
async function fetchList() {
  loading.value = true
  try {
    const data = await $fetch<{ items: UserListItem[]; total: number; page: number; pageSize: number }>('/api/users', {
      method: 'GET',
      params: { page: page.value, pageSize: pageSize.value, keyword: keyword.value.trim() },

    })
    list.value = data.items
    total.value = data.total
    page.value = data.page
    pageSize.value = data.pageSize
  } catch (e: any) {
    ElMessage.error(e?.data?.message || e?.message || '加载失败')
  } finally {
    loading.value = false
  }
}

function onSearch() {
  page.value = 1
  fetchList()
}

function onReset() {
  keyword.value = ''
  page.value = 1
  fetchList()
}

function handleButtonClick(button: any) {
  if (button.text === '新建') {
    openCreate()
  }
}

function onPageChange(p: number) {
  page.value = p
  fetchList()
}

function onPageSizeChange(ps: number) {
  pageSize.value = ps
  page.value = 1
  fetchList()
}

// 新建
function openCreate() {
  dialogTitle.value = '新建用户'
  editingId.value = null
  form.value = { username: '', name: '', avatar: '', password: '' }
  dialogVisible.value = true
}

// 编辑
function openEdit(row: UserListItem) {
  dialogTitle.value = '编辑用户'
  editingId.value = row.id
  form.value = {
    username: row.username,
    name: row.name || '',
    avatar: row.avatar || '',
    password: '' // 可选修改，留空则不改
  }
  dialogVisible.value = true
}

// 保存（新建/更新）
async function submitForm() {
  // 简单校验
  if (!form.value.username.trim()) {
    ElMessage.warning('请填写用户名')
    return
  }
  if (!editingId.value && !form.value.password.trim()) {
    ElMessage.warning('请填写密码')
    return
  }

  // 头像校验：允许为空；否则必须为 http/https 或 data:image/，且不可为邮箱
  {
    const avatarStr = form.value.avatar.trim()
    if (avatarStr) {
      if (avatarStr.includes('@')) {
        ElMessage.warning('头像URL不应填写邮箱，请使用图片地址')
        return
      }
      const ok = /^(https?:\/\/.+)|(^data:image\/)/i.test(avatarStr)
      if (!ok) {
        ElMessage.warning('请输入有效的头像URL（http/https 或 data:image/）')
        return
      }
    }
  }
  formLoading.value = true
  try {
    if (editingId.value) {
      // 更新
      await $fetch(`/api/users/${editingId.value}`, {
        method: 'PUT',
        body: {
          name: form.value.name.trim(),
          avatar: form.value.avatar.trim(),
          // 密码可选
          ...(form.value.password.trim() ? { password: form.value.password.trim() } : {})
        },

      })
      ElMessage.success('已更新')
    } else {
      // 创建
      await $fetch('/api/users', {
        method: 'POST',
        body: {
          username: form.value.username.trim(),
          name: form.value.name.trim(),
          avatar: form.value.avatar.trim(),
          password: form.value.password.trim()
        },

      })
      ElMessage.success('已创建')
    }
    dialogVisible.value = false
    fetchList()
  } catch (e: any) {
    ElMessage.error(e?.data?.message || e?.message || '提交失败')
  } finally {
    formLoading.value = false
  }
}

// 删除
async function onDelete(row: UserListItem) {
  try {
    await ElMessageBox.confirm(`确定要删除用户「${row.username}」吗？`, '提示', { type: 'warning' })
  } catch {
    return
  }
  try {
    await $fetch(`/api/users/${row.id}`, { method: 'DELETE' })
    ElMessage.success('已删除')
    // 如果删除后当前页无数据，回退一页
    if (list.value.length === 1 && page.value > 1) {
      page.value = page.value - 1
    }
    fetchList()
  } catch (e: any) {
    ElMessage.error(e?.data?.message || e?.message || '删除失败')
  }
}

onMounted(() => {
  fetchList()
  if (typeof window !== 'undefined') {
    window.addEventListener('refresh-profile', fetchList as any)
  }
})
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('refresh-profile', fetchList as any)
  }
})
</script>

<template>
  <div class="user-page">
    <!-- 搜索表单 -->
    <SearchForm
      :fields="searchFields"
      :buttons="searchButtons"
      @search="onSearch"
      @reset="onReset"
      @button-click="handleButtonClick"
    />

    <el-card shadow="never">
      <!-- 配置化表格 -->
      <ConfigTable
        :data="list"
        :columns="tableColumns"
        :loading="loading"
        :auto-height="true"
        :border="true"
        :auto-height-options="{
          offset: 40,
          minHeight: 300,
          maxHeight: 1200,
          includePagination: true,
          paginationSelector: '.pager'
        }"
      />

      <div class="pager">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          @current-change="onPageChange"
          @size-change="onPageSizeChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px" destroy-on-close>
      <el-form label-width="90px" :model="form" @submit.prevent>
        <el-form-item label="用户名">
          <el-input v-model="form.username" :disabled="!!editingId" maxlength="50" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.name" maxlength="50" />
        </el-form-item>
        <el-form-item label="头像URL">
          <el-input v-model="form.avatar" maxlength="300" placeholder="https://..." />
        </el-form-item>
        <el-form-item :label="editingId ? '新密码' : '密码'">
          <el-input v-model="form.password" type="password" show-password maxlength="100" :placeholder="editingId ? '留空则不修改' : ''" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.user-page {
  padding: 12px 0;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  align-items: center;
}
.w240 {
  width: 240px;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #ebeef5;
}
.pager {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
}
/* 扁平化+圆角设计（仅对本页生效，基于 design-flat 命名空间） */
.user-page {
  /* 可按需定制色板 */
  --df-border: #eef0f3;
  --df-border-strong: #e6e9ef;
  --df-bg-soft: #fafafa;
  --df-bg-card: #ffffff;
  --df-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  --df-shadow-strong: 0 6px 18px rgba(0, 0, 0, 0.06);
  --df-hover: #f5faff;
  --df-header: #f7f9fc;

  /* 卡片 */
  :deep(.el-card) {
    border-radius: 6px;
    border: 1px solid var(--df-border);
    box-shadow: var(--df-shadow);
    background: var(--df-bg-card);
  }
  :deep(.el-card__header) {
    padding: 14px 16px;
    border-bottom: 1px solid var(--df-border);
    font-weight: 600;
  }

  /* 输入框（更扁平、圆角） */
  :deep(.el-input__wrapper) {
    border-radius: 6px;
    background: var(--df-bg-soft);
    box-shadow: none;
    border: 1px solid transparent;
    transition: border-color .15s ease, background .15s ease;
  }
  :deep(.el-input__wrapper:hover) {
    border-color: var(--df-border-strong);
    background: #fff;
  }
  :deep(.is-focus .el-input__wrapper) {
    border-color: var(--el-color-primary);
    background: #fff;
  }

  /* 按钮（圆角扁平） */
  :deep(.el-button) {
    border-radius: 6px;
    box-shadow: none;
  }
  :deep(.el-button.is-plain) {
    background: var(--df-bg-soft);
    border-color: var(--df-border);
  }

  /* 表格（浅边框、柔和表头与 Hover） */
  :deep(.el-table) {
    --el-table-border-color: var(--df-border);
    --el-table-header-bg-color: var(--df-header);
    --el-table-row-hover-bg-color: var(--df-hover);
    border-radius: 6px;
    overflow: hidden;
  }
  :deep(.el-table .cell) {
    padding: 10px 12px;
  }
  :deep(.el-table__header th) {
    font-weight: 600;
  }

  /* 分页（圆角输入） */
  :deep(.el-pagination) {
    padding: 8px 0 0;
  }
  :deep(.el-pagination .el-input__wrapper) {
    border-radius: 6px;
    background: #fff;
  }

  /* 弹窗（圆角与分割线） */
  :deep(.el-dialog) {
    border-radius: 6px;
    box-shadow: var(--df-shadow-strong);
  }
  :deep(.el-dialog__header) {
    padding-bottom: 10px;
    border-bottom: 1px solid var(--df-border);
    margin-right: 0;
  }
  :deep(.el-dialog__footer) {
    border-top: 1px solid var(--df-border);
    padding-top: 12px;
  }

  /* 工具栏与头像图片 */

  .avatar {
    border-radius: 6px;
  }
}
</style>