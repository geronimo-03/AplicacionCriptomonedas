import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/bootstrap.min.css'
import '@/assets/js/bootstrap.bundle.min.js'

createApp(App).use(store).use(router).mount('#app')
