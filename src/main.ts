import { createApp } from "vue";
import "@assets/style/reset.css";
import "@assets/style/iconfont.css";
//import tippy
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; 
//import vue-router
import router from "./router/index";
import App from "./App.vue";

createApp(App).use(router).mount("#app");
