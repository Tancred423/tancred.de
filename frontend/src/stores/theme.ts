import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

type Theme = 'light' | 'dark' | 'auto'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'auto')

  const applyTheme = (newTheme: Theme) => {
    let actualTheme: 'light' | 'dark'

    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      actualTheme = prefersDark ? 'dark' : 'light'
    } else {
      actualTheme = newTheme
    }

    document.documentElement.setAttribute('data-theme', actualTheme)
    document.documentElement.style.colorScheme = actualTheme
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  watch(
    theme,
    () => {
      applyTheme(theme.value)
    },
    { immediate: true },
  )

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme.value === 'auto') {
      applyTheme('auto')
    }
  })

  return {
    theme,
    setTheme,
  }
})
