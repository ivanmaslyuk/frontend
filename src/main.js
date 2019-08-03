import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.mixin({
  data() {
    return {
      backendHost: "localhost:8080",
      wsPort: 3001,
      backendScheme: "http"
    };
  },
  methods: {
    backendBasePath() {
      return `${this.backendScheme}://${this.backendHost}`;
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
