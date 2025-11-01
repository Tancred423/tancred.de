<template>
  <div class="not-found">
    <div class="container">
      <div class="content-box">
        <pre class="ascii-title">
+------------------+
|  404 NOT FOUND   |
+------------------+</pre
        >
        <div class="content">
          <p class="message">The page you're looking for doesn't exist or has been moved.</p>
          <div class="actions">
            <router-link to="/" class="btn"> [ return home ] </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 3rem 0;
  align-items: center;
  justify-content: center;
}

.not-found .container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-box {
  background: var(--card-bg);
  border: 2px dashed var(--border);
  margin: 0 auto;
  max-width: 600px;
  padding: 2rem;
  text-align: center;
}

.ascii-title {
  color: var(--accent);
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.4;
  margin-bottom: 2rem;
}

.message {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.actions {
  margin-top: 2rem;
}

.btn {
  background: var(--accent);
  border: 2px solid var(--accent);
  color: white;
  display: inline-block;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

@media (max-width: 768px) {
  .ascii-art {
    font-size: 0.5rem;
  }
}
</style>
