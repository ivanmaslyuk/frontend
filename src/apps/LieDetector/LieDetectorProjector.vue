<template>
  <div class="bkg d-flex flex-column justify-content-center align-items-center">
    <div v-show="stage === 'SHOWING_QUESTIONS'">
      <h1>«{{args.questions[currentQuestion]}}»</h1>
      <div class="heartbeat-container d-flex justify-content-center align-items-center">
        <canvas v-show="fingerPlaced" id="heartbeat-canvas"></canvas>
        <h4 v-show="!fingerPlaced">Нет данных</h4>
      </div>
    </div>
    <div v-if="stage === 'PROCESSING_RESULTS'">
      <h3>Обработка результатов...</h3>
    </div>
    <div v-if="stage === 'SHOWING_RESULTS'">
      <h1>«{{ args.questions[currentResult] }}»</h1>
      <h2>Ответ: «{{ results[currentResult].answer ? 'Да' : 'Нет' }}»</h2>
      <h2>{{ results[currentResult].truth ? 'Правда' : 'Ложь' }}</h2>
    </div>

    <div v-if="stage === 'GAME_ENDED'"></div>
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
      currentResult: 0
    };
  },
  methods: {
    handleEvent(event, payload) {
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
        this.results = payload.results;
      }
      if (event === "next_answer_shown") {
        this.currentResult++;
      }
      if (event === "answers_ended") {
        this.stage = "GAME_ENDED";
      }
      if (event === "started_showing_results") {
        this.stage = "SHOWING_RESULTS";
      }
    },
    initHeartbeatDisplay() {
      const canvas = document.getElementById("heartbeat-canvas");
      this.heartbeatDisplay = new HeartbeatDisplay({
        strokeStyle: "rgb(255, 61, 0)",
        lineWidth: 3
      });
      this.heartbeatDisplay.streamTo(canvas);
    }
    // deviceConnected(deviceType, deviceName) {},
    // deviceDisconnected(deviceType, deviceName) {}
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
  width: 100vw;
  height: 300px;
}
#heartbeat-canvas {
  width: 100%;
  height: 100%;
}
</style>
