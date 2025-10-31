<template>
  <div class="admin-project-form">
    <div class="container">
      <div class="project-form card">
        <h2>{{ isEdit ? 'Edit Project' : 'Create New Project' }}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Title *</label>
            <input v-model="form.title" type="text" required />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>URL *</label>
            <input v-model="form.url" type="url" required />
          </div>

          <div class="form-group">
            <label>Image URL</label>
            <input v-model="form.imageUrl" type="url" />
          </div>

          <div class="form-group">
            <label>Order</label>
            <input v-model.number="form.order" type="number" />
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <button type="submit" class="btn" :disabled="loading">
              {{ loading ? '[ saving... ]' : '[ save ]' }}
            </button>
            <router-link to="/admin/projects" class="btn btn-secondary"> [ cancel ] </router-link>
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

const form = ref({
  title: '',
  description: '',
  url: '',
  imageUrl: '',
  order: 0,
})

const fetchProject = async () => {
  if (!isEdit.value) return

  try {
    const response = await axios.get(`${API_URL}/projects`)
    const project = response.data.find((p: any) => p.id === parseInt(route.params.id as string))

    if (project) {
      form.value = {
        title: project.title,
        description: project.description || '',
        url: project.url,
        imageUrl: project.imageUrl || '',
        order: project.order,
      }
    }
  } catch (err) {
    console.error('Failed to fetch project:', err)
  }
}

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const headers = authStore.getAuthHeader()

    if (isEdit.value) {
      await axios.put(`${API_URL}/projects/${route.params.id}`, form.value, { headers })
    } else {
      await axios.post(`${API_URL}/projects`, form.value, { headers })
    }

    router.push('/admin/projects')
  } catch (err) {
    errorMessage.value = 'Failed to save project'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProject()
})
</script>

<style scoped>
.admin-project-form {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 2rem 0;
}

.admin-project-form .container {
  flex: 1;
  max-width: 800px;
}

.project-form {
  margin: 0 auto;
}

.project-form:hover {
  box-shadow: 4px 4px 0 var(--shadow);
  transform: none;
}

.project-form h2 {
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
