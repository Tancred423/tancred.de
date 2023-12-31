<script setup>
function playAudio(link) {
  if (link) {
    const audio = new Audio(link)
    audio.volume = 0.5
    audio.play()
  }
}
</script>

<template>
  <div id="logo">
    <img src="/TancredAvatar.webp" alt="Tancred Avatar" />
    <div id="name">
      <h1 class="primary-color">TANCRED</h1>
      <div class="pronounciation">
        <a
          class="icon"
          @click="
            playAudio('https://www.collinsdictionary.com/sounds/hwd_sounds/en_gb_tancred.mp3')
          "
        >
          <font-awesome-icon icon="fa-solid fa-volume-high" />
        </a>
        <div class="written">/ˈtæŋkɹɪd/</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#logo {
  display: flex;
  height: 70px;
}

#logo img {
  border-radius: 50%;
  height: 70px;
  margin-right: 10px;
  width: 70px;
}

#logo #name {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#logo h1 {
  font-size: 50px;
  font-weight: 900;
  line-height: 45px;
  vertical-align: middle;
}

#logo .pronounciation {
  display: flex;
  font-size: 20px;
  font-weight: 400;
  line-height: 25px;
}

#logo .pronounciation .written {
  margin-left: 5px;
}
</style>
