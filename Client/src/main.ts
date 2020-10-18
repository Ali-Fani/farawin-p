import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style/index.scss'
// import './style/primevue.min.css'
import 'primevue/resources/themes/fluent-light/theme.css'
import 'primevue/resources/primevue.min.css'

const app = createApp(App)

app.use(router)

app.directive('autofocus', {
  mounted(el) {
    el.focus()
  },
})

app.mount('#app')
