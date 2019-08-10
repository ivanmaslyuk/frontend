<template>
  <div class="app-page">
    <p>Сессия: {{ sessionId }}</p>
    <router-link to="/">Назад</router-link>
    <h1>{{ appInfo.humanName }}</h1>
    <TestAppAdmin />
  </div>
</template>

<script>
import axios from "axios";
import TestAppAdmin from "../apps/TestApp/TestAppAdmin";

export default {
  name: "app-page",
  props: ["id"],
  components: { TestAppAdmin },
  data() {
    return {
      appInfo: {},
      sessionId: window.sessionId
    };
  },
  async mounted() {
    try {
      const basePath = this.backendBasePath();
      const response = await axios.get(`${basePath}/api/apps/${this.id}`);
      this.appInfo = response.data;
    } catch (err) {
      console.log(err);
    }
  },
  beforeRouteLeave(to, from, next) {
    window.syncService.removeMessageListener("app-page");
    if (this.app) {
      this.app.appClosed();
    }
    window.syncService.sendMessage({
      source: "device",
      event: "current_app_closed"
    });
    next();
  }
};
</script>
