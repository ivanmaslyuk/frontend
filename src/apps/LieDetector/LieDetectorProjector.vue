<template>
  <div class="bkg d-flex justify-content-center align-items-center">
    <h1>{{currentQuestion}}</h1>
  </div>
</template>

<script>
import AppProjectorMixin from "../../mixins/AppProjectorMixin";

export default {
  name: "lie-detector-app-projector",
  mixins: [AppProjectorMixin],
  data() {
    return {
      systemName: "lie_detector",
      currentQuestion: ""
    };
  },
  methods: {
    handleEvent(event, payload) {
      console.log(event);
      if (event === "next_question_shown") {
        this.currentQuestion = payload.question;
      }
    },
    deviceConnected(deviceType, deviceName) {},
    deviceDisconnected(deviceType, deviceName) {}
  }
};
</script>

<style scoped>
</style>
