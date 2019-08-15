<template>
  <div class="bkg d-flex justify-content-center align-items-center">
    <span
      class="text"
      v-bind:class="{red: color === 'red', green: color === 'green', blue: color === 'blue'}"
    >ТЕСТ</span>
  </div>
</template>

<script>
import AppMobileMixin from "../../mixins/AppMobileMixin";

export default {
  name: "test-app-mobile",
  mixins: [AppMobileMixin],
  data() {
    return {
      systemName: "test_app",
      color: "red"
    };
  },
  methods: {
    handleEvent(event, payload) {
      if (["red", "green", "blue"].includes(event)) {
        this.color = event;
      }
    }
  },
  deviceConnected(deviceType, deviceName) {},
  deviceDisconnected(deviceType, deviceName) {}
};
</script>

<style scoped>
.bkg {
  margin: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
}
.text {
  font-size: 20vw;
  font-weight: bolder;
}
.red {
  color: red;
}
.green {
  color: green;
}
.blue {
  color: blue;
}
</style>
