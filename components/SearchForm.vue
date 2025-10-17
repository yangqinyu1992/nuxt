<script setup lang="ts">
import { ref } from 'vue'

interface SearchField {
  type: 'input' | 'select' | 'date' | 'daterange' | 'number'
  prop: string
  label: string
  placeholder?: string
  options?: { label: string; value: any }[]
  width?: string
  clearable?: boolean
  defaultValue?: any
}

interface SearchButton {
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  text: string
  icon?: string
  loading?: boolean
  disabled?: boolean
}

interface SearchProps {
  fields: SearchField[]
  buttons?: SearchButton[]
  showReset?: boolean
  showSearch?: boolean
  inline?: boolean
  labelWidth?: string
}

const props = withDefaults(defineProps<SearchProps>(), {
  buttons: () => [],
  showReset: true,
  showSearch: true,
  inline: true,
  labelWidth: '90px'
})

const emit = defineEmits<{
  search: [formData: Record<string, any>]
  reset: []
  buttonClick: [button: SearchButton, formData: Record<string, any>]
}>()

// 表单数据
const formData = ref<Record<string, any>>({})

// 初始化表单数据
function initFormData() {
  props.fields.forEach(field => {
    formData.value[field.prop] = field.defaultValue || ''
  })
}

initFormData()

function handleSearch() {
  emit('search', { ...formData.value })
}

function handleReset() {
  initFormData()
  emit('reset')
}

function handleButtonClick(button: SearchButton) {
  emit('buttonClick', button, { ...formData.value })
}
</script>

<template>
  <div class="search-form">
    <div class="search-form-content">
      <!-- 搜索字段和按钮在同一行 -->
      <el-form 
        :model="formData" 
        :inline="inline" 
        :label-width="labelWidth"
        class="search-form-inner"
      >
        <!-- 搜索字段 -->
        <el-form-item
          v-for="field in fields"
          :key="field.prop"
          :label="field.label"
          :style="{ width: field.width || 'auto' }"
        >
          <!-- 输入框 -->
          <el-input
            v-if="field.type === 'input'"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder || `请输入${field.label}`"
            :clearable="field.clearable !== false"
            @keyup.enter="handleSearch"
          />
          
          <!-- 选择器 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder || `请选择${field.label}`"
            :clearable="field.clearable !== false"
            :style="{ width: field.width || '100%' }"
          >
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          
          <!-- 日期选择器 -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="formData[field.prop]"
            type="date"
            :placeholder="field.placeholder || `选择日期`"
            :clearable="field.clearable !== false"
            :style="{ width: field.width || '100%' }"
          />
          
          <!-- 日期范围 -->
          <el-date-picker
            v-else-if="field.type === 'daterange'"
            v-model="formData[field.prop]"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="field.clearable !== false"
            :style="{ width: field.width || '100%' }"
          />
          
          <!-- 数字输入框 -->
          <el-input-number
            v-else-if="field.type === 'number'"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder || `请输入${field.label}`"
            :style="{ width: field.width || '100%' }"
          />
        </el-form-item>
        
        <!-- 操作按钮（放在搜索字段后面） -->
        <el-form-item class="search-actions">
          <!-- 搜索按钮 -->
          <el-button
            v-if="showSearch"
            type="primary"
            @click="handleSearch"
          >
            查询
          </el-button>
          
          <!-- 重置按钮 -->
          <el-button
            v-if="showReset"
            @click="handleReset"
          >
            重置
          </el-button>
          
          <!-- 自定义按钮 -->
          <el-button
            v-for="button in buttons"
            :key="button.text"
            :type="button.type"
            :icon="button.icon"
            :loading="button.loading"
            :disabled="button.disabled"
            @click="handleButtonClick(button)"
          >
            {{ button.text }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.search-form {
  background: var(--df-bg-card, #ffffff);
  border: 1px solid var(--df-border, #eef0f3);
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: var(--df-shadow, 0 2px 10px rgba(0, 0, 0, 0.04));
}

.search-form-content {
  width: 100%;
}

.search-form-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px;
}

.search-actions {
  margin-left: 0;
  margin-bottom: 0;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
  background: var(--df-bg-soft, #fafafa);
  box-shadow: none;
  border: 1px solid transparent;
  transition: border-color .15s ease, background .15s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: var(--df-border-strong, #e6e9ef);
  background: #fff;
}

:deep(.is-focus .el-input__wrapper) {
  border-color: var(--el-color-primary);
  background: #fff;
}

:deep(.el-button) {
  border-radius: 6px;
  box-shadow: none;
}

/* 确保搜索字段与表格对齐 */
:deep(.search-form-inner .el-form-item) {
  margin-right: 0;
}

:deep(.search-form-inner .el-form-item__label) {
  text-align: left;
  justify-content: flex-start;
}

/* 移动端响应式优化 */
@media (max-width: 768px) {
  .search-form {
    padding: 12px;
    margin-bottom: 12px;
  }
  
  .search-form-inner {
    flex-direction: column;
    gap: 12px;
  }
  
  :deep(.search-form-inner .el-form-item) {
    width: 100%;
    margin-right: 0;
  }
  
  :deep(.search-form-inner .el-form-item__content) {
    width: 100%;
  }
  
  :deep(.search-form-inner .el-input),
  :deep(.search-form-inner .el-select),
  :deep(.search-form-inner .el-date-editor) {
    width: 100%;
  }
  
  .search-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    width: 100%;
  }
  
  .search-actions .el-button {
    flex: 1;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .search-form {
    padding: 8px;
  }
  
  .search-form-inner {
    gap: 8px;
  }
  
  .search-actions {
    flex-direction: column;
    gap: 4px;
  }
  
  .search-actions .el-button {
    width: 100%;
  }
}
</style>