import { createApp } from "vue";
import DjangoUtilsPlugin from "vue-plugin-django-utils";

import App from "./apps/Filtering.vue";

const rootElement = document.getElementById("vue-app");
const app = createApp(App);
app.use(DjangoUtilsPlugin, { rootElement });
app.mount(rootElement);
