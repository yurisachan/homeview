import { onMounted, onUnmounted } from 'vue'

export function useKeydown(key, callback) {
  const handleKeydown = (event) => {
    if (event.key === key) {
      event.preventDefault()
      callback(event)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
