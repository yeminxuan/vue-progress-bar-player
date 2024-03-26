import { createApp } from "vue";
import "@assets/style/reset.css";
import "@assets/style/iconfont.css";

//import vue-router
import router from "./router/index";
import App from "./App.vue";
const app = createApp(App);
app.use(router).mount("#app");
