<template>
  <header class="ascii-border-bottom">
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo">
          <h1 class="visually-hidden">Tancred Development Portfolio</h1>
          <pre class="logo-content">
   _____                             _ 
  |_   _|_ _ _ __   ___ _ __ ___  __| |
    | |/ _` | '_ \ / __| '__/ _ \/ _` |
    | | (_| | | | | (__| | |  __/ (_| |
    |_|\__,_|_| |_|\___|_|  \___|\__,_|
                                        
    [ DEVELOPMENT PORTFOLIO ]
          </pre>
        </router-link>

        <div class="header-actions">
          <ThemeToggle />

          <router-link v-if="!authStore.isAuthenticated()" to="/login" class="btn btn-secondary">
            [ login ]
          </router-link>

          <div v-else class="admin-menu">
            <span style="margin-right: 1rem">{{ authStore.username }}</span>
            <router-link
              to="/admin/projects"
              class="btn btn-secondary"
              :class="{ 'btn-active': isProjectsActive }"
            >
              projects
            </router-link>
            <router-link
              to="/admin/urls"
              class="btn btn-secondary"
              :class="{ 'btn-active': isUrlsActive }"
              style="margin-left: 0.5rem"
            >
              urls
            </router-link>
            <button class="btn btn-secondary" style="margin-left: 0.5rem" @click="handleLogout">
              logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isProjectsActive = computed(() => route.path === '/admin/projects')
const isUrlsActive = computed(() => route.path === '/admin/urls')

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
header {
  background: var(--bg-secondary);
  padding: 0.5rem 0;
}

.header-content {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
}

.logo {
  text-decoration: none;
}

.logo:hover {
  text-decoration: none;
}

.header-actions a {
  text-decoration: none;
}

.header-actions a:hover {
  text-decoration: none;
}

.visually-hidden {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.logo-content {
  color: var(--accent);
  font-size: 0.7rem;
  font-weight: bold;
  line-height: 1.2;
  margin: 0;
}

.header-actions {
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-menu {
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.admin-menu span {
  align-items: center;
  display: flex;
}

.btn-active {
  background: var(--accent) !important;
  border: 2px dashed var(--border) !important;
  color: var(--bg-primary) !important;
}

@media (max-width: 768px) {
  .header-content {
    align-items: flex-start;
    flex-direction: column;
  }

  .logo-content {
    font-size: 0.5rem;
  }
}
</style>
