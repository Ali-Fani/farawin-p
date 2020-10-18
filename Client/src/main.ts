import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style/index.scss'
// import './style/primevue.min.css'
import 'primevue/resources/themes/fluent-light/theme.css'
import 'primevue/resources/primevue.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)

app.use(router)
library.add(faUserSecret)
library.add(faEllipsisV)

app.component('font-awesome-icon', FontAwesomeIcon)

app.directive('autofocus', {
  mounted(el) {
    el.focus()
  },
})

app.mount('#app')
