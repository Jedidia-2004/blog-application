import { createApp } from "vue";
import { createPinia } from "pinia";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/main.css";

import App from "./App.vue";
import router from "./router";
import { useUserStore } from "./stores/user";

async function startApp() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);

  const userStore = useUserStore();
  await userStore.initializeAuth();

  app.use(router);
  app.mount("#app");
}

startApp();
