import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { store, key } from './store/index'
import 'element-plus/lib/theme-chalk/index.css';
import ElementPlus from 'element-plus';

const app = createApp(App)
app.use(router)
app.use(store, key)
app.use(ElementPlus)

app.mount('#app')
