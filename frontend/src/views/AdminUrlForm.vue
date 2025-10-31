<template>
  <div class="admin-url-form">
    <div class="container">
      <div class="url-form card">
        <h2>{{ isEdit ? 'Edit Short URL' : 'Create New Short URL' }}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Target URL *</label>
            <input v-model="form.targetUrl" type="url" required placeholder="https://example.com" />
          </div>

          <div class="form-group">
            <label>Short Code</label>
            <input
              v-model="form.code"
              type="text"
              pattern="[a-zA-Z0-9-_]+"
              title="Only letters, numbers, hyphens and underscores allowed"
              required
            />
            <small style="color: var(--text-secondary)">
              {{ isEdit ? 'Edit to customize.' : 'Random code generated. Edit to customize.' }}
              Note: "share" is reserved
            </small>
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <button type="submit" class="btn" :disabled="loading">
              {{ loading ? '[ saving... ]' : '[ save ]' }}
            </button>
            <router-link to="/admin/urls" class="btn btn-secondary"> [ cancel ] </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const errorMessage = ref('')

const generateRandomCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

const form = ref({
  code: '',
  targetUrl: '',
})

const fetchUrl = async () => {
  if (!isEdit.value) return

  try {
    const headers = authStore.getAuthHeader()
    const response = await axios.get(`${API_URL}/short-urls`, { headers })
    const url = response.data.find((u: any) => u.id === parseInt(route.params.id as string))

    if (url) {
      form.value = {
        code: url.code,
        targetUrl: url.targetUrl,
      }
    }
  } catch (err) {
    console.error('Failed to fetch URL:', err)
  }
}

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const headers = authStore.getAuthHeader()

    if (isEdit.value) {
      await axios.put(`${API_URL}/short-urls/${route.params.id}`, form.value, { headers })
    } else {
      await axios.post(`${API_URL}/short-urls`, form.value, { headers })
    }

    router.push('/admin/urls')
  } catch (err: any) {
    errorMessage.value = err.response?.data?.error || 'Failed to save short URL'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isEdit.value) {
    fetchUrl()
  } else {
    form.value.code = generateRandomCode()
  }
})
</script>

<style scoped>
.admin-url-form {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 2rem 0;
}

.admin-url-form .container {
  flex: 1;
  max-width: 800px;
}

.url-form {
  margin: 0 auto;
}

.url-form:hover {
  box-shadow: 4px 4px 0 var(--shadow);
  transform: none;
}

.url-form h2 {
  color: var(--accent);
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.error-message {
  background: #d9a0a0;
  border: 2px dashed var(--border);
  color: var(--bg-primary);
  margin-bottom: 1rem;
  padding: 1rem;
  text-align: center;
}
</style>
