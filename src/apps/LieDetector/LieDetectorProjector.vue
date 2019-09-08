<template>
  <div class="bkg d-flex flex-column justify-content-center align-items-center">
    <div v-show="stage === 'SHOWING_QUESTIONS'">
      <h1>«{{args.questions[currentQuestion]}}»</h1>
      <div class="heartbeat-container d-flex justify-content-center align-items-center">
        <canvas v-show="fingerPlaced" id="heartbeat-canvas"></canvas>
        <h4 v-show="!fingerPlaced">Игрок убрал палец с экрана</h4>
      </div>
    </div>
    <div v-if="stage === 'PROCESSING_RESULTS'">
      <h3>Обработка результатов...</h3>
    </div>
    <div v-if="stage === 'SHOWING_RESULTS'">
      <h1>«{{ args.questions[currentResult] }}»</h1>
      <h2>{{ results[currentResult] ? 'Правда' : 'Ложь' }}</h2>
    </div>
  </div>
</template>

<script>
import AppProjectorMixin from "../../mixins/AppProjectorMixin";
import HeartbeatDisplay from "./static/heartbeat-display";

export default {
  name: "lie-detector-app-projector",
  mixins: [AppProjectorMixin],
  props: ["args"],
  mounted() {
    this.initHeartbeatDisplay();
  },
  data() {
    return {
      systemName: "lie_detector",
      currentQuestion: 0,
      heartRate: 60,
      fingerPlaced: false,
      stage: "SHOWING_QUESTIONS",
      results: [],
      currentResult: -1
    };
  },
  methods: {
    handleEvent(event, payload) {
      console.log(event);
      if (event === "next_question_shown") {
        this.currentQuestion++;
      }
      if (event === "new_pulse_value") {
        this.heartRate = payload.value;
      }
      if (event === "player_placed_finger") {
        this.fingerPlaced = true;
      }
      if (event === "player_removed_finger") {
        this.fingerPlaced = false;
      }
      if (event === "questions_ended") {
        this.stage = "PROCESSING_RESULTS";
      }
      if (event === "next_answer_shown") {
        this.stage = "SHOWING_RESULTS";
        this.currentResult++;
        this.results.push(payload.answer);
      }
    },
    initHeartbeatDisplay() {
      const canvas = document.getElementById("heartbeat-canvas");
      this.heartbeatDisplay = new HeartbeatDisplay({
        strokeStyle: "rgb(255, 61, 0)",
        lineWidth: 3
      });
      this.heartbeatDisplay.streamTo(canvas);
    },
    deviceConnected(deviceType, deviceName) {},
    deviceDisconnected(deviceType, deviceName) {}
  },
  watch: {
    heartRate(newVal, oldVal) {
      this.heartbeatDisplay.setBPM(newVal);
    }
  }
};
</script>

<style scoped>
h4 {
  color: red;
}
.bkg {
  background: black;
  height: 100%;
  color: white;
}
.heartbeat-container {
  width: 500px;
  height: 160px;
}
#heartbeat-canvas {
  width: 100%;
  height: 100%;
}
</style>
