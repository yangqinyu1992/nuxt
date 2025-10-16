<script setup lang="ts">
import { onMounted } from 'vue'
import { navigateTo } from 'nuxt/app'

onMounted(() => {
  navigateTo('/login', { replace: true })
})
</script>

<template>
  <div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#909399;">
    正在跳转到登录页...
  </div>
</template>