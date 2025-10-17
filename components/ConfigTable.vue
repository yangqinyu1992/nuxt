<script setup lang="ts">
import { ref, computed } from 'vue'

interface TableColumn {
  prop?: string
  label: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean
  formatter?: (row: any, column: TableColumn, cellValue: any, index: number) => any
  render?: (scope: { row: any, column: TableColumn, $index: number }) => any
}

interface TableProps {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  height?: string | number
  autoHeight?: boolean
  border?: boolean
  stripe?: boolean
  showHeader?: boolean
  size?: 'default' | 'large' | 'small'
  rowKey?: string
  defaultSort?: { prop: string; order: 'ascending' | 'descending' }
  autoHeightOptions?: {
    offset?: number
    minHeight?: number
    maxHeight?: number
    includePagination?: boolean
    paginationSelector?: string
  }
}

const props = withDefaults(defineProps<TableProps>(), {
  loading: false,
  autoHeight: true,
  border: true,
  stripe: false,
  showHeader: true,
  size: 'default',
  rowKey: 'id',
  defaultSort: () => ({ prop: '', order: 'ascending' }),
  autoHeightOptions: () => ({})
})

const emit = defineEmits<{
  sortChange: [sort: { prop: string; order: 'ascending' | 'descending' }]
  selectionChange: [selection: any[]]
  rowClick: [row: any, column: any, event: Event]
}>()

// 使用自定义指令处理高度计算
const tableWrapper = ref<HTMLElement>()

const computedHeight = computed(() => {
  if (props.height) return props.height
  if (props.autoHeight) return 'auto'
  return 'auto'
})

const autoHeightDirectiveValue = computed(() => {
  if (!props.autoHeight) return undefined
  return {
    offset: 40,
    minHeight: 300,
    maxHeight: 1200,
    includePagination: true,
    ...props.autoHeightOptions
  }
})

function handleSortChange(sort: { prop: string; order: 'ascending' | 'descending' }) {
  emit('sortChange', sort)
}

function handleSelectionChange(selection: any[]) {
  emit('selectionChange', selection)
}

function handleRowClick(row: any, column: any, event: Event) {
  emit('rowClick', row, column, event)
}
</script>

<template>
  <div ref="tableWrapper" v-auto-height="autoHeightDirectiveValue" class="config-table-wrapper">
    <el-table
      :data="data"
      :height="computedHeight"
      :loading="loading"
      :border="border"
      :stripe="stripe"
      :show-header="showHeader"
      :size="size"
      :row-key="rowKey"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop || column.label"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align"
        :fixed="column.fixed"
        :sortable="column.sortable"
      >
        <template #default="scope">
          <template v-if="column.render">
            <component :is="column.render(scope)" />
          </template>
          <template v-else-if="column.formatter">
            {{ column.formatter(scope.row, column, scope.row[column.prop!], scope.$index) }}
          </template>
          <template v-else>
            {{ scope.row[column.prop!] || '-' }}
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.config-table-wrapper {
  width: 100%;
}

/* 移动端表格优化 */
@media (max-width: 768px) {
  .config-table-wrapper {
    min-height: 300px;
  }
  
  :deep(.el-table) {
    font-size: 12px;
  }
  
  :deep(.el-table .cell) {
    padding: 6px 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  :deep(.el-table th .cell) {
    font-size: 12px;
    font-weight: 600;
  }
  
  :deep(.el-pagination) {
    padding: 4px 0;
  }
  
  :deep(.el-pagination .btn-prev),
  :deep(.el-pagination .btn-next),
  :deep(.el-pagination .number) {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
  }
}

@media (max-width: 480px) {
  :deep(.el-table) {
    font-size: 11px;
  }
  
  :deep(.el-table .cell) {
    padding: 4px 6px;
  }
  
  :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  :deep(.el-pagination__total) {
    flex-basis: 100%;
    text-align: center;
    margin-bottom: 4px;
  }
}
</style>