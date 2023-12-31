<script setup>
import LogoComponent from './components/LogoComponent.vue'
import CardComponent from './components/CardComponent.vue'

// Servant Card
const servant = {
  logo: '/ServantProjectLogo.webp',
  title: 'SERVANT',
  content:
    'Servant is a bot for Discord, a VoIP application. Servant will help you to improve your Discord server by organizing and moderating channels, roles and members and by entertaining your members.',
  url: 'https://servant.tancred.de',
}

// Discord Timestamps Card
const discordTimestamps = {
  logo: '/DiscordTimestampsProjectLogo.webp',
  title: 'DISCORD TIMESTAMPS',
  content:
    'Discord timestamps are automatically updating parts in your Discord message. Every user will see these in their timezone. Choose whatever date and time you want, copy the code and paste it in your Discord message. Done!',
  url: 'https://discord-timestamps.tancred.de',
}
</script>

<template>
  <header></header>

  <main>
    <LogoComponent class="logo" />
    <div id="projects-wrapper">
      <h2>Projects</h2>
      <div class="projects">
        <CardComponent
          class="card"
          :logo="servant.logo"
          :title="servant.title"
          :content="servant.content"
          :url="servant.url"
        />
        <CardComponent
          class="card"
          :logo="discordTimestamps.logo"
          :title="discordTimestamps.title"
          :content="discordTimestamps.content"
          :url="discordTimestamps.url"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
#logo {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

h2 {
  text-align: center;
}

.projects {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

@media (min-width: 1024px) {
  h2 {
    text-align: left;
  }
}

/* Float Up */
@keyframes float-up {
  from {
    transform: translateY(150%);
  }
  to {
    transform: translateY(0);
  }
}

.logo {
  animation: float-up 0.75s ease-in;
  animation-delay: 250ms;
  animation-fill-mode: forwards;
  margin-bottom: 20px;
  transform: translateY(150%);
}

/* Fade In */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#projects-wrapper {
  animation: fade-in 0.5s ease-in;
  animation-delay: 1000ms;
  animation-fill-mode: forwards;
  opacity: 0;
}
</style>
