<template>
  <div class="home">
    <div v-for="app in apps" v-bind:key="app._id">
      <a :href="'#/app/' + app._id">{{ app.humanName }}</a>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";
import router from "../router";

export default {
  name: "home",
  data() {
    return {
      apps: []
    };
  },

  async mounted() {
    if (!this.sessionId) {
      if (localStorage.accessToken) {
        this.$syncService.connect("admin_console", (payload, err) => {
          if (err) {
            return console.log(err);
          }
          this.setSessionId(payload.sessionId);
        });
        this.$syncService.addMessageListener("home-page", this.handleMessage);
      } else {
        return router.replace({ name: "login" });
      }
    }

    try {
      const basePath = this.backendHost;
      const response = await axios.get(`${basePath}/api/apps`);
      this.apps = response.data;
    } catch (err) {
      console.log(err);
    }
  },

  computed: mapState(["sessionId"]),
  methods: {
    showToast(title, message) {
      this.$bvToast.toast(message, {
        title,
        autoHideDelay: 5000,
        appendToast: false
      });
    },

    handleMessage(message) {
      if (message.source !== "system") {
        return;
      }
      if (message.event === "device_connected") {
        const deviceType = message.payload.deviceType;
        const deviceName = message.payload.deviceName;
        const toastMessage =
          deviceType === "mobile"
            ? `Мобильное устройство ${deviceName} подключено.`
            : "Проектор подключен.";
        this.showToast("Устройство подключено", toastMessage);
      }
      if (message.event === "device_disconnected") {
        const deviceType = message.payload.deviceType;
        const deviceName = message.payload.deviceName;
        const toastMessage =
          deviceType === "mobile"
            ? `Мобильное устройство ${deviceName} отключено.`
            : "Проектор отключен.";
        this.showToast("Устройство отключено", toastMessage);
      }
    },

    ...mapMutations(["setSessionId"])
  }
};
</script>
