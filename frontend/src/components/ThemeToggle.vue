<template>
  <div class="theme-toggle">
    <button
      @click="cycleTheme"
      class="btn btn-secondary"
      :title="`Current theme: ${themeStore.theme}`"
    >
      [ {{ themeIcon }} ]
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()

const themeIcon = computed(() => {
  switch (themeStore.theme) {
    case 'light':
      return 'light'
    case 'dark':
      return 'dark'
    case 'auto':
      return 'auto'
    default:
      return 'auto'
  }
})

const cycleTheme = () => {
  const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto']
  const currentIndex = themes.indexOf(themeStore.theme)
  const nextIndex = (currentIndex + 1) % themes.length
  themeStore.setTheme(themes[nextIndex])
}
</script>

<style scoped>
.theme-toggle button {
  min-width: 60px;
}
</style>
