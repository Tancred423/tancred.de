<template>
  <div class="admin-urls">
    <div class="container">
      <div class="actions">
        <router-link to="/admin/urls/create" class="btn"> [ + new short url ] </router-link>
      </div>

      <div class="urls-list">
        <div v-if="loading && urls.length === 0" class="loading">Loading URLs...</div>

        <div v-else-if="error" class="error">{{ error }}</div>

        <div v-else-if="urls.length === 0" class="no-urls">No short URLs yet.</div>

        <div v-else class="url-item card" v-for="url in urls" :key="url.id">
          <div class="url-info">
            <div class="short-url">
              <strong>{{ SHORTENER_DOMAIN }}/{{ url.code }}</strong>
            </div>
            <div class="target-url">→ {{ url.targetUrl }}</div>
            <div class="url-stats">
              <span class="clicks">{{ url.clicks }} clicks</span>
              <span class="date">Created: {{ formatDate(url.createdAt) }}</span>
            </div>
          </div>
          <div class="url-actions">
            <router-link :to="`/admin/urls/edit/${url.id}`" class="btn btn-secondary">
              [ edit ]
            </router-link>
            <button @click="deleteUrl(url.id)" class="btn btn-danger">[ delete ]</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const SHORTENER_DOMAIN = import.meta.env.VITE_SHORTENER_DOMAIN
const authStore = useAuthStore()
const router = useRouter()

interface ShortUrl {
  id: number
  code: string
  targetUrl: string
  clicks: number
  createdAt: string
  updatedAt: string
}

const urls = ref<ShortUrl[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchUrls = async () => {
  try {
    loading.value = true
    error.value = null
    const headers = authStore.getAuthHeader()
    const response = await axios.get(`${API_URL}/short-urls`, { headers })
    urls.value = response.data
  } catch (err: any) {
    console.error('Failed to fetch URLs:', err)
    if (err.response?.status === 401) {
      authStore.logout()
      router.push('/login')
    } else {
      error.value = 'Failed to load URLs. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const deleteUrl = async (id: number) => {
  if (!confirm('Are you sure you want to delete this short URL?')) return

  try {
    const headers = authStore.getAuthHeader()
    await axios.delete(`${API_URL}/short-urls/${id}`, { headers })
    await fetchUrls()
  } catch (err) {
    console.error('Failed to delete short URL:', err)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  fetchUrls()
})
</script>

<style scoped>
.admin-urls {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 3rem 0;
}

.admin-urls .container {
  flex: 1;
}

.actions {
  margin-bottom: 2rem;
  margin-top: 1rem;
}

.urls-list {
  margin-top: 2rem;
}

.url-item {
  align-items: flex-start;
  display: flex;
  gap: 2rem;
  justify-content: space-between;
}

@media (max-width: 1000px) {
  .url-item {
    flex-direction: column;
  }

  .url-actions {
    width: 100%;
  }
}

.url-item:hover {
  box-shadow: 4px 4px 0 var(--shadow);
  transform: none;
}

.url-info {
  flex: 1;
}

.short-url {
  color: var(--accent);
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.target-url {
  color: var(--text-secondary);
  margin: 0.5rem 0;
  word-break: break-all;
}

.url-stats {
  color: var(--text-secondary);
  display: flex;
  font-size: 0.9rem;
  gap: 2rem;
  margin-top: 1rem;
}

.clicks {
  font-weight: bold;
}

.url-actions {
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.url-actions .btn {
  height: 100%;
}

.loading,
.no-urls {
  color: var(--text-secondary);
  padding: 2rem;
  text-align: center;
}
</style>
