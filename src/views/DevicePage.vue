<template>
  <div class="root d-flex justify-content-center align-items-center">
    <div class="header" v-if="!currentApp">
      <span class="brand">EventStore</span>
    </div>

    <div
      v-bind:class="{'align-self-start': !isProjector, 'form-top-margin': !isProjector}"
      v-if="!connected"
    >
      <div class="subtitle" v-if="!isProjector">Подключение устройства</div>
      <div class="subtitle" v-if="isProjector">Подключение проектора</div>
      <p v-if="invalidSessionIdEntered" class="error-message">Неверный код сессии.</p>
      <form @submit="connect" id="login-form">
        <input
          class="sid-input form-control"
          type="number"
          v-model="sessionId"
          placeholder="Код сессии"
        />
      </form>
      <button class="connect-btn btn btn-primary" form="login-form">Подключиться</button>
      <div class="help-link">
        <a>Как получить код сессии?</a>
      </div>
    </div>

    <div v-if="connected && !currentApp">
      <span v-if="!isProjector" class="title">{{deviceName}} подключено</span>
      <span v-if="isProjector" class="title">Проектор подключен</span>
      <br />
      <span class="secondary-text">Выберите приложение в панели управления, чтобы начать.</span>
    </div>

    <div v-if="loading">Загрузка</div>

    <div v-if="sessionTerminated">
      <span class="title">Сессия закрыта</span>
      <br />
      <span
        class="secondary-text"
      >Сервер закрыл сессию, так как было потеряно подключение к панели управления.</span>
    </div>

    <div v-if="errorAccured">
      <span class="title">Ошибка</span>
      <br />
      <span class="secondary-text">Не удается установить соединение с сервером.</span>
    </div>

    <div v-if="currentApp && !isProjector">
      <TestAppMobile v-if="currentApp === 'test_app'" />
    </div>

    <div v-if="currentApp && isProjector">
      <TestAppProjector v-if="currentApp === 'test_app'" />
    </div>
  </div>
</template>

<script>
export default {
  name: "device-page",
  props: { isProjector: false },
  components: {
    TestAppMobile: () => import("../apps/TestApp/TestAppMobile"),
    TestAppProjector: () => import("../apps/TestApp/TestAppProjector")
  },
  data() {
    return {
      connected: false,
      loading: false,
      sessionTerminated: false,
      errorAccured: false,
      sessionId: null,
      invalidSessionIdEntered: false,
      currentApp: null,
      deviceName: null
    };
  },
  mounted() {
    this.$syncService.addMessageListener("device-page", this.handleMessage);
  },
  methods: {
    connect(e) {
      this.$syncService.connect(
        this.isProjector ? "projector" : "mobile",
        (payload, err) => {
          if (err) {
            this.invalidSessionIdEntered = true;
          } else {
            this.connected = true;
            this.currentApp = payload.currentApp;
            this.deviceName = payload.yourName;
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
.form-top-margin {
  margin-top: 105px;
}
.title {
  font-size: 24px;
}
.secondary-text {
  font-size: 16px;
  color: #707070;
}
.error-message {
  color: red;
}
.brand {
  font-size: 30px;
  color: #2176ff;
}
.header {
  position: absolute;
  top: 0;
  padding: 30px 0;
  text-align: center;
}
.root {
  text-align: center;
  width: 100vw;
  height: 100vh;
}
.subtitle {
  margin-bottom: 30px;
  font-size: 22px;
}
.sid-input {
  width: 90vw;
  height: 56px;
}
.connect-btn {
  margin-top: 20px;
  width: 90vw;
  padding: 8px;
}
.help-link {
  margin-top: 35px;
  color: #2176ff;
  font-size: 16px;
}
@media (min-width: 576px) {
  .sid-input {
    width: 400px;
  }
  .connect-btn {
    width: 400px;
  }
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
