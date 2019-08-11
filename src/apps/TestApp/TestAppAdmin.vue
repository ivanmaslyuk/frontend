<template>
  <div>
    <button v-on:click="sendRed">Красный</button>
    <button v-on:click="sendGreen">Зеленый</button>
    <button v-on:click="sendBlue">Синий</button>
  </div>
</template>

<script>
import AppAdminMixin from "../../mixins/AppAdminMixin";

export default {
  name: "test-app-admin",
  data() {
    return {
      systemName: "test_app"
    };
  },
  mixins: [AppAdminMixin],
  methods: {
    sendRed() {
      this.sendMessage("red");
    },
    sendGreen() {
      this.sendMessage("green");
    },
    sendBlue() {
      this.sendMessage("blue");
    },
    handleEvent(event, payload) {},
    deviceConnected(deviceType, deviceName) {},
    deviceDisconnected(deviceType, deviceName) {}
  },
  beforeDestroy() {
    // app closed
  }
};
</script>
