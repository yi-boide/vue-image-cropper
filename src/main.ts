import { createApp } from 'vue'
import App from './App.vue'
import ImageCropperInstall from '../packages'

const app = createApp(App)
app.use(ImageCropperInstall)

app.mount('#app')
