<script setup>
const props = defineProps(['logo', 'title', 'content', 'url'])
</script>

<template>
  <div class="card">
    <div class="content-wrapper">
      <div class="card-header">
        <img :src="props.logo" alt="Project Logo" />
        <div class="title">{{ props.title }}</div>
      </div>
      <div class="card-body">{{ props.content }}</div>
    </div>
    <a :href="url" class="button">Open</a>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  max-width: 300px;
  padding: 20px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-header {
  align-items: center;
  display: flex;
}

.card-header .title {
  font-size: 20px;
  font-weight: 900;
  line-height: 25px;
  vertical-align: middle;
}

.card-header img {
  border-radius: 10px;
  height: 50px;
  margin-right: 10px;
  width: 50px;
}

.card-body {
  font-style: italic;
  text-align: justify;
}

.button {
  background-color: var(--primary-color);
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  padding: 10px;
  text-align: center;
  transition: background-color 0.3s ease-in-out;
}

.button:hover {
  background-color: var(--primary-color-mute);
}
</style>
