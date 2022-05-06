import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'

// createApp(App).use(store).use(router).mount('#app')
const app = createApp(App)

app.use(store, key)
app.use(router)
app.mount('#app')
