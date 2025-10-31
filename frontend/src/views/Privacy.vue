<template>
  <div class="privacy">
    <div class="container">
      <div class="content-box">
        <pre class="ascii-title">
+--------------------+
|   PRIVACY POLICY   |
+--------------------+</pre
        >

        <div class="content">
          <section>
            <h2>Overview</h2>
            <p>This website is a personal portfolio showcasing my projects.</p>
          </section>

          <section>
            <h2>Data Collection</h2>
            <p>
              In none of my projects I collect any information other than the information that is
              explicitly required by the project. This includes this portfolio website, which does
              not collect any information at all.
            </p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              I use local storage to maintain your theme preference. No third-party cookies are
              used.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              If you have questions about this privacy policy, please contact me via email:
              <a href="mailto:hi@tancred.de">hi@tancred.de</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 3rem 0;
}

.privacy .container {
  flex: 1;
}

.content-box {
  background: var(--card-bg);
  border: 2px dashed var(--border);
  margin: 0 auto;
  max-width: 800px;
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

.content section {
  margin-bottom: 2rem;
}

.content h2 {
  color: var(--accent);
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.content p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1rem;
}

.content ul {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-left: 2rem;
}
</style>
