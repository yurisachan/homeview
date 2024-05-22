import { onMounted, onUnmounted, ref } from 'vue'

export function useEventListener(target, eventType, listener) {
  onMounted(() => {
    target.addEventListener(eventType, listener)
  })

  onUnmounted(() => {
    target.removeEventListener(eventType, listener)
  })
}

function debounce(fn, delay) {
  let timeoutId = null
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export function useDebouncedEventListener(target, eventType, listener, options = {}) {
  const { debounce: shouldDebounce = true, delay = 200 } = options
  const debouncedListener = ref(listener)

  // 如果需要 debounce，使用 debounce 包装 listener
  if (shouldDebounce) {
    debouncedListener.value = debounce(listener, delay)
  }

  onMounted(() => {
    target.addEventListener(eventType, debouncedListener.value)
  })

  onUnmounted(() => {
    target.removeEventListener(eventType, debouncedListener.value)
  })
}
