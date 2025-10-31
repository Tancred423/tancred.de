<template>
  <footer class="ascii-border-top">
    <div class="container">
      <div class="footer-content">
        <div class="footer-text">
          <pre class="ascii-divider">
+---------------------------------------+
          </pre>
          <p>&copy; {{ currentYear }} Tancred</p>
        </div>
        <router-link to="/privacy" class="footer-link"> [ privacy policy ] </router-link>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
footer {
  background: var(--bg-secondary);
  margin-top: auto;
  padding: 2rem 0;
}

.footer-content {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
}

.footer-text {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
}

.ascii-divider {
  color: var(--border);
  font-size: 0.75rem;
  line-height: 1.2;
  margin: 0 0 0.5rem 0;
}

.footer-link {
  color: var(--accent);
  font-weight: bold;
}

@media (max-width: 768px) {
  .footer-content {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
