import type { Directive, DirectiveBinding } from 'vue'

interface AutoHeightOptions {
  offset?: number
  minHeight?: number
  maxHeight?: number
  includePagination?: boolean
  paginationSelector?: string
  resizeDebounce?: number
}

interface AutoHeightBinding extends DirectiveBinding {
  value?: AutoHeightOptions | number
}

const defaultOptions: AutoHeightOptions = {
  offset: 20,
  minHeight: 200,
  maxHeight: Infinity,
  includePagination: true,
  paginationSelector: '.pager, .el-pagination, [class*="pagination"]',
  resizeDebounce: 150
}

let resizeObserver: ResizeObserver | null = null
const elementCallbacks = new WeakMap<Element, () => void>()

function calculateHeight(el: HTMLElement, options: AutoHeightOptions): number {
  const windowHeight = window.innerHeight
  const rect = el.getBoundingClientRect()
  const topDistance = rect.top
  
  let height = windowHeight - topDistance - (options.offset || 0)
  
  // 如果包含分页组件，减去分页组件的高度
  if (options.includePagination) {
    const paginationEl = el.parentElement?.querySelector(options.paginationSelector || '') as HTMLElement
    if (paginationEl) {
      const paginationRect = paginationEl.getBoundingClientRect()
      const paginationHeight = paginationRect.height
      height -= paginationHeight + 10 // 额外减去一些间距
    }
  }
  
  // 应用最小和最大高度限制
  height = Math.max(height, options.minHeight || 200)
  height = Math.min(height, options.maxHeight || Infinity)
  
  return height
}

function updateHeight(el: HTMLElement, binding: AutoHeightBinding) {
  const options = typeof binding.value === 'number' 
    ? { ...defaultOptions, offset: binding.value }
    : { ...defaultOptions, ...binding.value }
  
  const height = calculateHeight(el, options)
  el.style.height = `${height}px`
}

function createResizeObserver() {
  if (!resizeObserver) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const callback = elementCallbacks.get(entry.target)
        if (callback) {
          callback()
        }
      }
    })
  }
  return resizeObserver
}

const autoHeightDirective: Directive = {
  mounted(el: HTMLElement, binding: AutoHeightBinding) {
    const options = typeof binding.value === 'number' 
      ? { ...defaultOptions, offset: binding.value }
      : { ...defaultOptions, ...binding.value }
    
    let timeoutId: NodeJS.Timeout
    
    const debouncedUpdate = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => updateHeight(el, binding), options.resizeDebounce)
    }
    
    // 初始计算
    updateHeight(el, binding)
    
    // 监听窗口大小变化
    window.addEventListener('resize', debouncedUpdate)
    
    // 监听父元素大小变化
    const resizeObserver = createResizeObserver()
    if (el.parentElement) {
      resizeObserver.observe(el.parentElement)
      elementCallbacks.set(el.parentElement, debouncedUpdate)
    }
    
    // 存储清理函数
    ;(el as any)._autoHeightCleanup = () => {
      window.removeEventListener('resize', debouncedUpdate)
      if (el.parentElement) {
        resizeObserver.unobserve(el.parentElement)
        elementCallbacks.delete(el.parentElement)
      }
      clearTimeout(timeoutId)
    }
  },
  
  updated(el: HTMLElement, binding: AutoHeightBinding) {
    updateHeight(el, binding)
  },
  
  unmounted(el: HTMLElement) {
    const cleanup = (el as any)._autoHeightCleanup
    if (cleanup) {
      cleanup()
      delete (el as any)._autoHeightCleanup
    }
  }
}

export default autoHeightDirective