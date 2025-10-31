<template>
  <div class="login">
    <div class="container">
      <div class="login-box">
        <pre class="ascii-title">
+------------------+
|   ADMIN LOGIN    |
+------------------+</pre
        >

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter username"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter password"
              required
            />
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn" :disabled="loading">
            {{ loading ? '[ loading... ]' : '[ login ]' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  const success = await authStore.login(username.value, password.value)

  if (success) {
    router.push('/admin/projects')
  } else {
    errorMessage.value = 'Invalid credentials. Please try again.'
  }

  loading.value = false
}
</script>

<style scoped>
.login {
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 3rem 0;
}

.login-box {
  background: var(--card-bg);
  border: 2px dashed var(--border);
  box-shadow: 6px 6px 0 var(--shadow);
  margin: 0 auto;
  max-width: 500px;
  padding: 2rem;
}

.ascii-title {
  color: var(--accent);
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.4;
  margin-bottom: 2rem;
  text-align: center;
}

.error-message {
  background: #d9a0a0;
  border: 2px dashed var(--border);
  color: var(--bg-primary);
  margin-bottom: 1rem;
  padding: 1rem;
  text-align: center;
}

button[type='submit'] {
  width: 100%;
}
</style>
