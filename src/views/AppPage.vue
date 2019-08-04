<template>
  <div class="app-page">
    <p>Сессия: {{ sessionId }}</p>
    <router-link to="/">Назад</router-link>
    <h1>{{ appInfo.humanName }}</h1>
    <div id="app-containter"></div>
  </div>
</template>

<script>
import axios from "axios";
import { setTimeout } from "timers";

export default {
  name: "app-page",
  props: ["id"],
  data() {
    return {
      appInfo: {},
      sessionId: window.sessionId,
      app: null
    };
  },
  mounted() {
    axios
      .get(`${this.backendBasePath()}/api/apps/${this.id}`)
      .then(response => {
        this.appInfo = response.data;
        this.loadApp();
      })
      .catch(err => console.log(err));
  },
  methods: {
    async loadApp() {
      const appContainer = document.getElementById("app-containter");
      try {
        const basePath = `${this.backendBasePath()}/app_embeds/${
          this.appInfo.systemName
        }`;
        const html = await axios.get(`${basePath}/admin_layout.html`);
        const js = await axios.get(`${basePath}/AdminController.js`);
        appContainer.innerHTML = html.data;
        const evalResult = eval(js.data);

        this.launchApp();
      } catch (err) {
        appContainer.innerHTML = "<h3>Не удалось запустить приложение.</h3>";
        console.log(err);
      }
    },

    async launchApp() {
      window.syncService.addMessageListener("app-page", this.handleMessage);
      window.syncService.sendMessage({
        source: "device",
        event: "app_launched",
        payload: {
          name: this.appInfo.systemName
        }
      });
      this.app.sendMessage = this.sendMessage;
      this.app.appLaunched();
    },

    sendMessage(event, payload) {
      if (this.app) {
        window.syncService.sendMessage({
          source: this.appInfo.systemName,
          event,
          payload: payload || {}
        });
      } else {
        console.error("No app is launched. Can't send message.");
      }
    },

    handleMessage(message) {
      if (message.source === "system") {
        const payload = message.payload;
        if (message.event === "device_disconnected" && this.app) {
          return this.app.deviceDisconnected(
            payload.deviceType,
            payload.deviceName
          );
        }
        if (message.event === "device_connected" && this.app) {
          return this.app.deviceConnected(
            payload.deviceType,
            payload.deviceName
          );
        }
      }
      if (this.app && message.source === this.appInfo.systemName) {
        return this.app.handleEvent(message.event, message.payload);
      }
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
