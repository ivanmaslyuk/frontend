<template>
  <div>
    <div v-if="stage === 'ADDING_QUESTIONS'" class="row">
      <div class="col-12">
        <div class="mb-2">
          <span class="text-secondary">Введите несколько вопросов, чтобы начать</span>
        </div>
        <div class="mb-2">
          <span class="text-danger" v-if="questioinsFormWarning">{{ questioinsFormWarning }}</span>
        </div>
        <div
          class="input-group"
          v-for="(question, questionIndex) in questions"
          :key="questionIndex"
        >
          <input
            class="form-control mb-2"
            type="text"
            placeholder="Введите вопрос"
            v-model.trim="questions[questionIndex]"
          />
          <div class="input-group-append">
            <button class="btn btn-link" @click="removeQuestion(questionIndex)">Удалить</button>
          </div>
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
            <h4>Тестируемый убрал палец с экрана</h4>
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
          <div class="d-flex justify-content-between">
            <div>
              <span class="text-secondary">Текущий вопрос:</span>
              <br />
              <h2 style="display: inline-block">«{{ questions[currentQuestion] }}»</h2>
            </div>
            <div>
              <div class="btn-group answer-choices mb-2">
                <span>«Да»</span>
                <button
                  class="btn btn-outline-success"
                  @click="answerSelected(true, true)"
                  :disabled="!fingerPlaced"
                >Правда</button>
                <button
                  class="btn btn-outline-danger"
                  @click="answerSelected(true, false)"
                  :disabled="!fingerPlaced"
                >Ложь</button>
              </div>
              <br />
              <div class="btn-group answer-choices">
                <span>«Нет»</span>
                <button
                  class="btn btn-outline-success"
                  @click="answerSelected(false, true)"
                  :disabled="!fingerPlaced"
                >Правда</button>
                <button
                  class="btn btn-outline-danger"
                  @click="answerSelected(false, false)"
                  :disabled="!fingerPlaced"
                >Ложь</button>
              </div>
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
          <button class="btn btn-primary" @click="startedShowingResults">Начать показ результатов</button>
        </div>
      </div>
    </div>

    <div
      v-if="stage === 'SHOWING_ANSWERS'"
      class="d-flex flex-column align-items-center justify-content-center"
    >
      <h2>«{{ questions[currentAnswer] }}»</h2>
      <h3>Ответ: «{{ answers[currentAnswer].answer ? 'Да' : 'Нет' }}»</h3>
      <h3>{{ answers[currentAnswer].truth ? 'Правда' : 'Ложь' }}</h3>
      <button
        class="btn btn-primary"
        @click="showNextResult"
      >{{ showingLastResult ? 'Завершить' : 'Следующий ответ' }}</button>
    </div>

    <div
      class="d-flex align-content-center justify-content-center"
      v-if="stage === 'GAME_ENDED'"
      style="height: 400px"
    >
      <h4>Конец игры</h4>
    </div>
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
      currentAnswer: 0,
      stage: "ADDING_QUESTIONS",
      questions: JSON.parse(localStorage.lieDetectorQuestions || '[""]'),
      fingerPlaced: false,
      answers: [],
      questioinsFormWarning: null
    };
  },

  mounted() {
    this.initHeartbeatDisplay();
  },

  methods: {
    handleEvent(event, payload) {
      if (event === "player_placed_finger") {
        this.fingerPlaced = true;
      }
      if (event === "player_removed_finger") {
        this.fingerPlaced = false;
      }
    },

    raiseHeartRate() {
      // TODO: сделать чтобы прибавлялось от 7 до 10
      this.heartRate += parseInt(Math.random() * 10);
    },

    lowerHeartRate() {
      this.heartRate -= parseInt(Math.random() * 10);
    },

    showNextResult() {
      if (this.currentAnswer + 1 < this.questions.length) {
        this.currentAnswer += 1;
      } else {
        this.stage = "GAME_ENDED";
      }

      this.sendMessage("answer_skipped");
    },

    startedShowingResults() {
      this.sendMessage("started_showing_results");
      this.stage = "SHOWING_ANSWERS";
    },

    initHeartbeatDisplay() {
      const canvas = document.getElementById("heartbeat-canvas");
      this.heartbeatDisplay = new HeartbeatDisplay({
        strokeStyle: "rgb(255, 61, 0)",
        lineWidth: 3
      });
      this.heartbeatDisplay.streamTo(canvas);
    },

    answerSelected(answeredYes, toldTruth) {
      const answer = {
        answer: answeredYes,
        truth: toldTruth
      };
      this.sendMessage("question_answered", answer);
      this.answers.push(answer);

      if (this.currentQuestion + 1 === this.questions.length) {
        this.stage = "QUESTIONS_ENDED";
      } else {
        this.currentQuestion += 1;
      }
    },

    addQuestion() {
      this.questions.push("");
    },

    removeQuestion(index) {
      this.questions.splice(index, 1);
    },

    startGame() {
      let valid = true;
      for (const i in this.questions) {
        const question = this.questions[i];
        if (question.trim().length === 0) {
          valid = false;
          this.questioinsFormWarning = "Заполните пустые поля или удалите их";
        }
      }
      if (this.questions.length === 0) {
        valid = false;
        this.questioinsFormWarning = "Добавьте хотя бы один вопрос";
      }
      if (valid) {
        this.launch({ questions: this.questions });
        this.stage = "SHOWING_QUESTIONS";
      }
    }
  },

  watch: {
    heartRate(newVal, oldVal) {
      this.heartbeatDisplay.setBPM(newVal);
      this.sendMessage("new_pulse_value", { value: newVal });
    },

    questions(newVal, oldVal) {
      localStorage.lieDetectorQuestions = JSON.stringify(newVal);
    }
  },

  computed: {
    showingLastResult() {
      return this.currentAnswer + 1 === this.answers.length;
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
.answer-choices {
  border: solid 1px #eee;
  border-radius: 4px;
}
.answer-choices > span {
  margin: 0 10px;
  align-self: center;
  width: 50px;
  text-align: center;
}
.btn-group .btn:not(:hover),
.btn-group .btn:disabled {
  border-color: #eee;
  border-top-color: white;
  border-bottom-color: white;
}
.input-group .btn {
  height: 38px;
}
.input-group .form-control {
  border-radius: 4px;
}
</style>