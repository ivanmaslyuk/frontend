<template>
  <div class="app-page">
    <router-link to="/">Назад</router-link>
    <h1>{{ appInfo.humanName }}</h1>
    <TestAppAdmin v-if="appInfo.systemName === 'test_app'" />
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import { mapState } from "vuex";

export default {
  name: "app-page",
  props: ["id"],
  components: { TestAppAdmin: () => import("../apps/TestApp/TestAppAdmin") },
  data() {
    return {
      appInfo: {}
    };
  },
  async mounted() {
    if (!this.sessionId) {
      router.replace({ name: "home" });
    }
    try {
      const basePath = this.backendBasePath();
      const response = await axios.get(`${basePath}/api/apps/${this.id}`);
      this.appInfo = response.data;
    } catch (err) {
      console.log(err);
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$syncService.removeMessageListener("app-page");
    if (this.app) {
      this.app.appClosed();
    }
    this.$syncService.sendMessage({
      source: "device",
      event: "current_app_closed"
    });
    next();
  },
  computed: mapState(["sessionId"])
};
</script>
