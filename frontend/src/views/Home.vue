<template>
  <div class="home">
    <div class="container">
      <section class="intro">
        <p class="intro-text">Welcome to my project hub. Explore my work and creations.</p>
      </section>

      <section class="projects">
        <div v-if="loading" class="loading">
          <pre>
+------------------+
| Loading...       |
+------------------+
          </pre>
        </div>

        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
        </div>

        <div v-else-if="projects.length === 0" class="no-projects">No projects yet.</div>

        <div v-else class="projects-grid">
          <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProjectCard from '../components/ProjectCard.vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface Project {
  id: number
  title: string
  description?: string
  url: string
  imageUrl?: string
  order: number
}

const projects = ref<Project[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchProjects = async () => {
  try {
    loading.value = true
    const response = await axios.get(`${API_URL}/projects`)
    projects.value = response.data
  } catch (err) {
    error.value = 'Failed to load projects'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.home {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 2rem 0;
}

.home .container {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.intro {
  margin-bottom: 2rem;
  text-align: center;
}

.intro-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0 auto;
  max-width: 1000px;
}

.projects-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.loading,
.error,
.no-projects {
  padding: 3rem;
  text-align: center;
}

.ascii-box {
  color: var(--text-secondary);
  display: inline-block;
  font-size: 0.9rem;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .ascii-art {
    font-size: 0.5rem;
  }
}
</style>
