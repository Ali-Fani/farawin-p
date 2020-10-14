import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style/index.scss'

const app = createApp(App)

app.use(router)

app.directive('autofocus', {
  mounted(el) {
    el.focus()
  },
})

app.mount('#app')
