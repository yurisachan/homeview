import { ref } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const storedValue = ref(JSON.parse(localStorage.getItem(key)) || defaultValue)

  const saveToLocalStorage = () => {
    localStorage.setItem(key, JSON.stringify(storedValue.value))
  }

  return [storedValue, saveToLocalStorage]
}

export function useSessionStorage(key, defaultValue) {
  const storedValue = ref(JSON.parse(sessionStorage.getItem(key)) || defaultValue)

  const saveToSessionStorage = () => {
    sessionStorage.setItem(key, JSON.stringify(storedValue.value))
  }

  return [storedValue, saveToSessionStorage]
}
