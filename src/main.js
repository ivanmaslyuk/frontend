import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import SyncSerciceFrontend from "../js/SyncServiceFrontend";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { ToastPlugin } from "bootstrap-vue";
import config from "./config";
Vue.use(ToastPlugin);

Vue.config.productionTip = false;

Vue.mixin({
  data() {
    return {
      backendHost: config.backendHost
    };
  },
  computed: {
    $syncService() {
      if (!window.syncService) {
        window.syncService = new SyncSerciceFrontend(
          config.wsHost,
          config.wsPort
        );
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
