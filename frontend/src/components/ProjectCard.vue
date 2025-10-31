<template>
  <a :href="project.url" rel="noopener noreferrer" class="project-card card">
    <div v-if="project.imageUrl" class="project-image">
      <img :src="project.imageUrl" :alt="project.title" />
    </div>
    <div class="project-content">
      <h3 class="project-title">
        <div class="ascii-title-box">
          <div class="title-top">{{ titleBox.top }}</div>
          <div v-for="(line, index) in titleBox.lines" :key="index" class="title-middle">
            {{ line }}
          </div>
          <div class="title-bottom">{{ titleBox.bottom }}</div>
        </div>
      </h3>
      <p v-if="project.description" class="project-description">
        {{ project.description }}
      </p>
      <div class="project-url">
        <code>--> {{ formatUrl(project.url) }}</code>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Project {
  id: number
  title: string
  description?: string
  url: string
  imageUrl?: string
  order: number
}

const props = defineProps<{
  project: Project
}>()

const formatUrl = (url: string) => {
  try {
    const urlObj = new URL(url)
    const displayPath = urlObj.pathname === '/' ? '' : urlObj.pathname
    return urlObj.hostname + displayPath
  } catch {
    return url
  }
}

const MAX_LINE_LENGTH = 30
const MIN_BOX_WIDTH = 30

const titleBox = computed(() => {
  const title = props.project.title
  const lines: string[] = []

  if (title.length <= MAX_LINE_LENGTH) {
    lines.push(title)
  } else {
    const words = title.split(' ')
    let currentLine = ''

    for (const word of words) {
      if (word.length > MAX_LINE_LENGTH) {
        if (currentLine.length > 0) {
          lines.push(currentLine)
        }
        lines.push(word.substring(0, MAX_LINE_LENGTH - 1) + '-')
        currentLine = word.substring(MAX_LINE_LENGTH - 1)
      } else if (currentLine.length === 0) {
        currentLine = word
      } else if (currentLine.length + 1 + word.length <= MAX_LINE_LENGTH) {
        currentLine += ' ' + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine)
    }
  }

  const maxLength = Math.max(...lines.map(l => l.length), MIN_BOX_WIDTH)
  const borderLength = maxLength + 2

  return {
    top: '+' + '-'.repeat(borderLength) + '+',
    lines: lines.map(line => '| ' + line.padEnd(maxLength) + ' |'),
    bottom: '+' + '-'.repeat(borderLength) + '+',
  }
})
</script>

<style scoped>
.project-card {
  color: inherit;
  cursor: pointer;
  display: block;
  text-decoration: none;
}

.project-image {
  border: 2px dashed var(--border);
  height: 200px;
  margin-bottom: 1rem;
  overflow: hidden;
  width: 100%;
}

.project-image img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.project-title {
  margin-bottom: 1rem;
}

.ascii-title-box {
  color: var(--accent);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  font-weight: bold;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
}

.title-top,
.title-middle,
.title-bottom {
  white-space: pre;
}

.project-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  white-space: pre-line;
}

.project-url {
  border-top: 2px dashed var(--border);
  margin-top: auto;
  padding-top: 1rem;
}

.project-url code {
  color: var(--accent);
  font-size: 0.9rem;
}
</style>
