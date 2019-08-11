<template>
  <div>
    <div v-if="!connected">
      <p v-if="invalidSessionIdEntered" class="error-message">Неверный код сессии.</p>
      <form @submit="connect">
        <input type="number" v-model="sessionId" placeholder="Код сессии" />
        <input type="submit" />
      </form>
    </div>
    <div v-if="connected && !currentApp">Ожидание запуска приложения</div>
    <div v-if="loading">Загрузка</div>
    <div v-if="sessionTerminated">Сессия прервана</div>
    <div v-if="errorAccured">Ошибка</div>
    <div v-if="currentApp">
      <TestAppMobile v-if="currentApp === 'test_app'" />
    </div>
  </div>
</template>

<script>
export default {
  name: "mobile-page",
  components: {
    TestAppMobile: async () => import("../apps/TestApp/TestAppMobile")
  },
  data() {
    return {
      connected: false,
      loading: false,
      sessionTerminated: false,
      errorAccured: false,
      sessionId: null,
      invalidSessionIdEntered: false,
      currentApp: null
    };
  },
  mounted() {
    this.$syncService.addMessageListener("mobile-page", this.handleMessage);
  },
  methods: {
    connect(e) {
      this.$syncService.connect(
        "mobile",
        (payload, err) => {
          if (err) {
            this.invalidSessionIdEntered = true;
          } else {
            this.connected = true;
            this.currentApp = payload.currentApp;
          }
        },
        this.sessionId
      );

      e.preventDefault();
    },
    handleMessage(message) {
      if (message.source === "system") {
        if (message.event === "app_launched") {
          this.currentApp = message.payload.name;
        }

        if (message.event === "current_app_closed") {
          this.currentApp = null;
        }

        if (message.event === "session_terminated") {
          this.sessionTerminated = true;
        }
      }
    }
  }
};
</script>

<style scoped>
.error-message {
  color: red;
}
</style>
