<script setup lang="ts">
definePageMeta({ layout: false })
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

interface LoginForm {
  username: string
  password: string
  remember: boolean
}

const formRef = ref()
const usernameCookie = useCookie<string | null>('login_username')

const form = reactive<LoginForm>({
  username: usernameCookie.value || '',
  password: '',
  remember: !!usernameCookie.value,
})

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const loading = ref(false)
const showPassword = ref(false)

const submit = () => {
  // @ts-ignore element-plus 校验回调
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      const { error } = await useFetch('/api/auth/login', {
        method: 'POST',
        server: false,
        body: { username: form.username, password: form.password },
      })
      if (error.value) throw error.value

      if (form.remember) {
        usernameCookie.value = form.username
      } else {
        usernameCookie.value = null
      }
      ElMessage.success('登录成功')
      navigateTo('/home')
    } catch (e) {
      try { ElMessage.closeAll() } catch {}
      ElMessage.error({
        message: '登录失败：账号或密码错误',
        duration: 2000,
        showClose: true
      })
    } finally {
      loading.value = false
    }
  })
}

const onForgot = () => {
  ElMessage.info('忘记密码：请联系管理员或走找回流程')
}
const onRegister = () => {
  navigateTo('/register')
}

// 进入登录页禁用页面滚动，离开时恢复
onMounted(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.add('no-scroll')
  }
})
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('no-scroll')
  }
})
</script>

<template>
  <div class="login-container">
    <div class="login-panel">
      <div class="panel-left">
        <div class="brand">
          <div class="brand-logo">Nuxt</div>
          <div class="brand-title">企业后台管理系统</div>
          <div class="brand-desc">基于 Nuxt + Element Plus，提供高效的中后台体验</div>
        </div>
      </div>

      <div class="panel-right">
        <el-card class="login-card" shadow="never">
          <div class="card-header">
            <div class="logo">EP</div>
            <div class="title">
              <h2>欢迎登录</h2>
              <p>请输入您的账号和密码</p>
            </div>
          </div>

          <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
            <el-form-item label="账号" prop="username">
              <el-input
                v-model="form.username"
                placeholder="请输入账号"
                :prefix-icon="User"
                clearable
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                clearable
              >
                <template #suffix>
                  <el-button
                    link
                    type="primary"
                    @click="showPassword = !showPassword"
                  >{{ showPassword ? '隐藏' : '显示' }}</el-button>
                </template>
              </el-input>
            </el-form-item>

            <div class="form-extras">
              <el-checkbox v-model="form.remember">记住我</el-checkbox>
              <div class="links">
                <el-button link type="primary" @click="onForgot">忘记密码</el-button>
                <el-divider direction="vertical" />
                <el-button link type="primary" @click="onRegister">注册账号</el-button>
              </div>
            </div>

            <el-button
              class="submit-btn"
              type="primary"
              size="large"
              :loading="loading"
              @click="submit"
              block
            >
              登录
            </el-button>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style>
/* 禁用整页滚动条（仅登录页生效） */
.no-scroll {
  overflow: hidden !important;
}
</style>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(1200px 600px at 10% 10%, #f0f5ff 0%, #f7f9fc 40%, #eef3ff 70%, #e6f0ff 100%);
}
.login-panel {
  width: 980px;
  max-width: 96vw;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  align-items: stretch;
}
.panel-left {
  border-radius: 16px;
  background: linear-gradient(135deg, #4c6ef5 0%, #3b5bdb 50%, #364fc7 100%);
  color: #fff;
  padding: 36px;
  display: flex;
  align-items: center;
}
.brand {
  max-width: 520px;
}
.brand-logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  margin-bottom: 16px;
}
.brand-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}
.brand-desc {
  font-size: 14px;
  opacity: 0.9;
}
.panel-right {
  display: flex;
  align-items: center;
}
.login-card {
  width: 100%;
  border-radius: 16px;
  padding: 4px 4px 16px 4px;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 8px 4px 8px;
}
.logo {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #4c6ef5;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.title h2 {
  margin: 0;
  font-size: 20px;
}
.title p {
  margin: 4px 0 0;
  color: #909399;
  font-size: 13px;
}
.form-extras {
  margin: 4px 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.links {
  display: flex;
  align-items: center;
  gap: 4px;
}
.submit-btn {
  width: 100%;
  margin-top: 4px;
}
@media (max-width: 900px) {
  .login-panel {
    grid-template-columns: 1fr;
  }
  .panel-left {
    min-height: 180px;
  }
}
</style>