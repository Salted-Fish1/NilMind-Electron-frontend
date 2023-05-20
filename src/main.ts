import { createApp } from "vue"
import App from "./App.vue"
import router from "./router/index"
import { createPinia } from "pinia"
import "normalize.css"
import "./sass/main.scss"
// import './samples/node-api'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
router.push({ name: "welcome" })

app.use(pinia)
app.mount("#app")
	.$nextTick(() => {
		postMessage({ payload: "removeLoading" }, "*")
	})
