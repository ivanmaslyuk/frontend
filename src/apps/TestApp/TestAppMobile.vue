<template>
  <div
    class="bkg"
    v-bind:class="{red: color === 'red', green: color === 'green', blue: color === 'blue'}"
  ></div>
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
}
.red {
  background-color: red;
}
.green {
  background-color: green;
}
.blue {
  background-color: blue;
}
</style>
