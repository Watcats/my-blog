import { createApp } from 'vue'
import App from './App.vue'
//引入mavonEditor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// use
const app=createApp(App)
app.use(mavonEditor)

app.mount('#app')
