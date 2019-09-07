<template>
  <div class="app d-flex flex-column align-items-center justify-content-center">
    <div v-if="!questionsEnded">
      <div class="alert-wrapper">
        <span class="alert" v-if="!isFingerPlaced">ПРИЛОЖИТЕ ПАЛЕЦ</span>
      </div>
      <div @touchstart="fingerPlaced" @touchend="fingerRemoved">
        <img class="fingerprint" v-if="isFingerPlaced" src="./img/fingerprint.svg" />
        <img class="fingerprint" v-if="!isFingerPlaced" src="./img/fingerprint-red.svg" />
      </div>
      <div class="alert-wrapper"></div>
    </div>
    <div v-if="questionsEnded">
      <span class="alert" style="padding: 0">ТЕСТИРОВАНИЕ ОКОНЧЕНО</span>
    </div>
  </div>
</template>

<script>
import AppMobileMixin from "../../mixins/AppMobileMixin";

export default {
  name: "lie-detector-app-mobile",
  mixins: [AppMobileMixin],
  data() {
    return {
      systemName: "lie_detector",
      isFingerPlaced: false,
      questionsEnded: false
    };
  },
  methods: {
    handleEvent(event, payload) {
      if (event === "questions_ended") {
        this.questionsEnded = true;
      }
    },

    fingerPlaced() {
      this.sendMessage("player_placed_finger");
      this.isFingerPlaced = true;
    },

    fingerRemoved() {
      this.sendMessage("player_removed_finger");
      this.isFingerPlaced = false;
    }
  },
  deviceConnected(deviceType, deviceName) {},
  deviceDisconnected(deviceType, deviceName) {}
};
</script>

<style scoped>
body {
  background: black;
}
.app {
  width: 100%;
  height: 100%;
  background-color: black;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.fingerprint {
  width: 150px;
  height: 218px;
}
.alert-wrapper {
  height: 2rem;
  margin-bottom: 50px;
}
.alert {
  font-size: 2rem;
  color: white;
}
</style>
