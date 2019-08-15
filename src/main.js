import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import SyncSerciceFrontend from "../js/SyncServiceFrontend";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { ToastPlugin } from "bootstrap-vue";
Vue.use(ToastPlugin);

Vue.config.productionTip = false;

Vue.mixin({
  data() {
    return {
      backendHost: "192.168.2.45:8080",
      wsPort: 3001,
      backendScheme: "http"
    };
  },
  methods: {
    backendBasePath() {
      return `${this.backendScheme}://${this.backendHost}`;
    }
  },
  computed: {
    $syncService() {
      if (!window.syncService) {
        window.syncService = new SyncSerciceFrontend("192.168.2.45", 3001);
      }
      return window.syncService;
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
