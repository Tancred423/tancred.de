import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
library.add(faVolumeHigh)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
