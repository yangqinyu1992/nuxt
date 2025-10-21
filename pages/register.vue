<script setup lang="ts">
definePageMeta({ layout: false })
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

interface RegisterForm {
  username: string
  password: string
  confirm: string
  name: string
}

const formRef = ref()
const form = reactive<RegisterForm>({
  username: '',
  password: '',
  confirm: '',
  name: '',
})

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  confirm: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_: any, v: string, cb: any) => {
        if (v !== form.password) cb(new Error('两次密码不一致'))
        else cb()
      },
      trigger: 'blur'
    }
  ]
}

const loading = ref(false)

const submit = async () => {
  // @ts-ignore
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      const { error } = await useFetch('/api/auth/register', {
        method: 'POST',
        server: false,
        body: { username: form.username, password: form.password, name: form.name }
      })
      if (error.value) throw error.value
      ElMessage.success('注册成功，已登录')
      navigateTo('/')
    } catch (e: any) {
      console.error('register error ->', e)
      const msg = e?.data?.message || e?.data?.statusMessage || e?.message || '注册失败：用户名已存在或服务器错误'
      ElMessage.error(msg)
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-panel">
      <div class="panel-left">
        <div class="brand">
          <div class="brand-logo">Nuxt</div>
          <div class="brand-title">企业后台管理系统</div>
          <div class="brand-desc">欢迎注册新账户</div>
        </div>
      </div>

      <div class="panel-right">
        <el-card class="login-card" shadow="never">
          <div class="card-header">
            <div class="logo">EP</div>
            <div class="title">
              <h2>用户注册</h2>
              <p>请输入账号与密码，支持设置昵称</p>
            </div>
          </div>

          <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
            <el-form-item label="账号" prop="username">
              <el-input v-model="form.username" placeholder="请输入账号" :prefix-icon="User" clearable />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
              <el-input v-model="form.name" placeholder="请输入昵称" clearable />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" clearable />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirm">
              <el-input v-model="form.confirm" type="password" placeholder="请再次输入密码" :prefix-icon="Lock" clearable />
            </el-form-item>

            <el-button class="submit-btn" type="primary" size="large" :loading="loading" @click="submit" block>
              注册并登录
            </el-button>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  background: radial-gradient(1200px 600px at 10% 10%, #f0f5ff 0%, #f7f9fc 40%, #eef3ff 70%, #e6f0ff 100%);
  overflow-y: auto;
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
.brand { max-width: 520px; }
.brand-logo { width: 56px; height: 56px; border-radius: 16px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-weight: 800; margin-bottom: 16px; }
.brand-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
.brand-desc { font-size: 14px; opacity: 0.9; }
.panel-right { display: flex; align-items: center; }
.login-card { width: 100%; border-radius: 16px; padding: 4px 4px 16px 4px; }
.card-header { display: flex; align-items: center; gap: 12px; margin: 8px 8px 4px 8px; }
.logo { width: 40px; height: 40px; border-radius: 12px; background: #4c6ef5; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; }
.title h2 { margin: 0; font-size: 20px; }
.title p { margin: 4px 0 0; color: #909399; font-size: 13px; }
.submit-btn { width: 100%; margin-top: 4px; }
@media (max-width: 900px) {
  .login-panel { grid-template-columns: 1fr; }
  .panel-left { min-height: 180px; }
}
</style>
