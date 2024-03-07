import { createApp } from "vue";
import "@assets/style/reset.css";
import "@assets/style/iconfont.css";
//引入vue-router
import router from "./router/index";
import App from "./App.vue";

createApp(App).use(router).mount("#app");
