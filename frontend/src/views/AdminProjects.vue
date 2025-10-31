<template>
  <div class="admin-projects">
    <div class="container">
      <div class="actions">
        <router-link to="/admin/projects/create" class="btn"> [ + new project ] </router-link>
      </div>

      <div class="projects-list">
        <div v-if="loading && projects.length === 0" class="loading">Loading projects...</div>

        <div v-else-if="projects.length === 0" class="no-projects">No projects yet.</div>

        <div v-else class="project-item card" v-for="project in projects" :key="project.id">
          <div class="project-info">
            <div class="project-field">
              <span class="field-label">Title:</span>
              <span class="field-value">{{ project.title }}</span>
            </div>

            <div v-if="project.description" class="project-field">
              <span class="field-label">Description:</span>
              <span class="field-value description-text">{{ project.description }}</span>
            </div>

            <div class="project-field">
              <span class="field-label">URL:</span>
              <a :href="project.url" target="_blank" rel="noopener noreferrer" class="project-link">
                {{ project.url }}
              </a>
            </div>

            <div v-if="project.imageUrl" class="project-field">
              <span class="field-label">Image URL:</span>
              <a
                :href="project.imageUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="project-link"
              >
                {{ project.imageUrl }}
              </a>
            </div>

            <div class="project-field">
              <span class="field-label">Order:</span>
              <span class="field-value">{{ project.order }}</span>
            </div>
          </div>
          <div class="project-actions">
            <router-link :to="`/admin/projects/edit/${project.id}`" class="btn btn-secondary">
              [ edit ]
            </router-link>
            <button @click="deleteProject(project.id)" class="btn btn-danger">[ delete ]</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const authStore = useAuthStore()

interface Project {
  id: number
  title: string
  description?: string
  url: string
  imageUrl?: string
  order: number
}

const projects = ref<Project[]>([])
const loading = ref(false)

const fetchProjects = async () => {
  try {
    loading.value = true
    const response = await axios.get(`${API_URL}/projects`)
    projects.value = response.data
  } catch (err) {
    console.error('Failed to fetch projects:', err)
  } finally {
    loading.value = false
  }
}

const deleteProject = async (id: number) => {
  if (!confirm('Are you sure you want to delete this project?')) return

  try {
    const headers = authStore.getAuthHeader()
    await axios.delete(`${API_URL}/projects/${id}`, { headers })
    await fetchProjects()
  } catch (err) {
    console.error('Failed to delete project:', err)
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.admin-projects {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 3rem 0;
}

.admin-projects .container {
  flex: 1;
}

.actions {
  margin-bottom: 2rem;
  margin-top: 1rem;
}

.projects-list {
  margin-top: 2rem;
}

.project-item {
  align-items: flex-start;
  display: flex;
  gap: 2rem;
  justify-content: space-between;
}

@media (max-width: 1000px) {
  .project-item {
    flex-direction: column;
  }

  .project-actions {
    width: 100%;
  }
}

.project-item:hover {
  box-shadow: 4px 4px 0 var(--shadow);
  transform: none;
}

.project-info {
  flex: 1;
}

.project-field {
  align-items: flex-start;
  display: flex;
  gap: 0.5rem;
  margin: 0.75rem 0;
}

.project-field:first-child {
  margin-top: 0;
}

.field-label {
  color: var(--text-secondary);
  flex-shrink: 0;
  font-size: 0.9rem;
  font-weight: bold;
  min-width: 120px;
}

.field-value {
  color: var(--text-primary);
}

.description-text {
  white-space: pre-line;
}

.project-link {
  color: var(--accent);
  text-decoration: none;
  transition: opacity 0.2s ease;
  word-break: break-all;
}

.project-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.project-actions {
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-actions .btn {
  height: 100%;
}

.loading,
.no-projects {
  color: var(--text-secondary);
  padding: 2rem;
  text-align: center;
}
</style>
