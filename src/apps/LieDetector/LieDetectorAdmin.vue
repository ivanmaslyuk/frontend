<template>
  <div>
    <div v-if="stage === 'ADDING_QUESTIONS'" class="row">
      <div class="col-12">
        <div class="mb-2">
          <span class="text-secondary">Введите несколько вопросов, чтобы начать</span>
        </div>
        <div v-for="(question, questionIndex) in questions" v-bind:key="questionIndex">
          <input
            class="form-control mb-2"
            type="text"
            placeholder="Введите вопрос"
            v-model.trim="questions[questionIndex]"
          />
        </div>

        <div class="d-flex justify-content-between mt-2">
          <button @click="addQuestion()" class="btn btn-secondary">Добавить вопрос</button>
          <button @click="startGame()" class="btn btn-primary">Начать игру</button>
        </div>
      </div>
    </div>

    <div v-show="stage === 'SHOWING_QUESTIONS'">
      <div class="row align-items-center">
        <div class="col-3">
          <button
            class="btn btn-outline-dark hr-btn"
            v-on:click="raiseHeartRate()"
            :disabled="!fingerPlaced"
          >
            <img src="./img/down-arrow.svg" class="btn-icon reversed" />Поднять пульс
          </button>
          <button
            class="btn btn-outline-dark hr-btn"
            v-on:click="lowerHeartRate()"
            :disabled="!fingerPlaced"
          >
            <img src="./img/down-arrow.svg" class="btn-icon" />Снизить пульс
          </button>
        </div>
        <div class="col-9" style="height: 160px">
          <canvas v-show="fingerPlaced" id="heartbeat-canvas"></canvas>
          <div
            class="d-flex align-items-center justify-content-center"
            v-if="!fingerPlaced"
            style="height: 100%"
          >
            <h4>Игрок убрал палец с экрана</h4>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-3"></div>
        <div class="col-9">
          <div class="d-flex justify-content-center">
            <h4
              style="color: rgb(255, 61, 0)"
              :class="{seethrough: !fingerPlaced}"
            >{{ heartRate }} уд/мин</h4>
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: 30px">
        <div class="col-12">
          <span class="text-secondary">Текущий вопрос:</span>
          <div class="d-flex justify-content-between">
            <h2 style="display: inline-block">«{{ questions[currentQuestion] }}»</h2>
            <div>
              <button
                class="btn btn-success mr-2"
                @click="truthSelected()"
                :disabled="!fingerPlaced"
              >Правда</button>
              <button class="btn btn-danger" @click="lieSelected()" :disabled="!fingerPlaced">Ложь</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row" v-if="stage === 'QUESTIONS_ENDED'">
      <div class="col-12">
        <div
          style="height: 400px"
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <h3 class="mb-5">Вопросы закончились</h3>
          <button
            class="btn btn-primary"
            @click="stage = 'SHOWING_ANSWERS'"
          >Начать показ результатов</button>
        </div>
      </div>
    </div>

    <div v-if="stage === 'SHOWING_ANSWERS'">ответы</div>
  </div>
</template>

<script>
import AppAdminMixin from "../../mixins/AppAdminMixin";
import HeartbeatDisplay from "./static/heartbeat-display";

export default {
  name: "lie-detector-app-admin",
  mixins: [AppAdminMixin],

  data() {
    return {
      systemName: "lie_detector",
      heartRate: 60,
      currentQuestion: 0,
      stage: "ADDING_QUESTIONS",
      questions: [""],
      fingerPlaced: false
    };
  },

  mounted() {
    this.initHeartbeatDisplay();
  },

  methods: {
    handleEvent(event, payload) {
      // TODO: сделать чтобы кнопки были неактивны и показывалось сообщение когда убрали палец
      console.log(event);
    },
    deviceConnected(deviceType, deviceName) {},
    deviceDisconnected(deviceType, deviceName) {},

    raiseHeartRate() {
      // TODO: сделать чтобы прибавлялось от 7 до 10
      this.heartRate += parseInt(Math.random() * 10);
    },

    lowerHeartRate() {
      this.heartRate -= parseInt(Math.random() * 10);
    },

    initHeartbeatDisplay() {
      const canvas = document.getElementById("heartbeat-canvas");
      this.heartbeatDisplay = new HeartbeatDisplay({
        strokeStyle: "rgb(255, 61, 0)",
        lineWidth: 3
      });
      this.heartbeatDisplay.streamTo(canvas);
    },

    questionSkipped() {
      if (this.currentQuestion + 1 === this.questions.length) {
        this.stage = "QUESTIONS_ENDED";
      } else {
        this.currentQuestion += 1;
      }
    },

    lieSelected() {
      this.sendMessage("lie_selected");
      this.questionSkipped();
    },

    truthSelected() {
      this.sendMessage("truth_selected");
      this.questionSkipped();
    },

    addQuestion() {
      this.questions.push("");
    },

    startGame() {
      // TODO: сделать валидацию вопросов
      // TODO: сохранить вопросы в localStorage
      this.launch({ questions: this.questions });
      this.stage = "SHOWING_QUESTIONS";
    }
  },

  watch: {
    heartRate(newVal, oldVal) {
      this.heartbeatDisplay.setBPM(newVal);
      this.sendMessage("new_pulse_value", { value: newVal });
    }
  }
};
</script>

<style scoped>
#heartbeat-canvas {
  height: 160px;
  width: 100%;
}
.hr-btn {
  width: 100%;
  height: 55px;
  margin-top: 15px;
  box-shadow: none;
}
.hr-btn:first-child {
  margin-top: 0;
}
.btn-outline-dark {
  border-color: #eee;
}
.btn-outline-dark:hover:not(:disabled) {
  background-color: #eee;
  border-color: #eee;
  color: black;
}
.btn.btn-outline-dark:not(:disabled):not(.disabled):active,
.btn.btn-outline-dark:not(:disabled):not(.disabled).active,
.show > .btn-outline-dark.dropdown-toggle {
  color: black;
  background-color: #ddd;
  border-color: #ddd;
}
.btn-icon {
  height: 16px;
  width: 16px;
  margin-right: 5px;
}
.reversed {
  transform: rotateX(180deg);
}

.seethrough {
  opacity: 0;
}
</style>