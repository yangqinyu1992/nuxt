export async function useClientFetch<T=any>(url: string, opts: any = {}) {
  if (typeof window === 'undefined') return null as unknown as T
  try {
    // 默认 GET，可通过 opts.method/headers/body 覆盖
    return await $fetch<T>(url, opts)
  } catch (e: any) {
    const msg = String(e?.message || '')
    if (e?.name === 'AbortError' || /aborted|premature close/i.test(msg)) {
      return null as unknown as T
    }
    throw e
  }
}