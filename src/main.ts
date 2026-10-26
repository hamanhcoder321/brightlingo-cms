import { createApp } from "vue";
import "@styles/main.css";

import App from "./App.vue";
import router from "./app/router";
import { pinia } from "./app/store";
import i18n from "./app/i18n";

async function bootstrap() {
  const app = createApp(App);

  // Initialize Pinia store
  app.use(pinia);

  // Initialize i18n
  app.use(i18n);

  // Initialize Vue Router
  app.use(router);

  // Mount Application
  app.mount("#app");
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap EngNest CMS:", error);
});
