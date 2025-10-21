<template>
  <div>
    <h1>数据库连接测试</h1>
    <el-button @click="testConnection" :loading="loading">测试连接</el-button>
    <div v-if="result">
      <h2>测试结果:</h2>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElButton } from 'element-plus'

const loading = ref(false)
const result = ref(null)

const testConnection = async () => {
  loading.value = true
  try {
    const { data } = await useFetch('/api/db/connection')
    result.value = data.value
  } catch (error) {
    result.value = {
      success: false,
      message: '请求失败',
      error: error.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 4px;
}
</style>
