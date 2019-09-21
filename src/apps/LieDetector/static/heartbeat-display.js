import { TimeSeries, SmoothieChart } from "./smoothie";

export default class HeartbeatDisplay {
  constructor(options) {
    this.options = options;
    this.smoothieInstance = new SmoothieChart({
      grid: {
        fillStyle: "rgba(1, 1, 1, 0)",
        strokeStyle: "rgba(0, 0, 0, 0)",
        millisPerLine: 1000
      },
      labels: { fillStyle: "rgba(0, 0, 0, 0)" },
      millisPerPixel: 10,
      minValue: 0,
      maxValue: 100,
      interpolation: "linear",
      limitFPS: 60,
      responsive: true
    });
    this.line = new TimeSeries({
      resetBounds: false,
      resetBoundsInterval: 0
    });
    this.smoothieInstance.addTimeSeries(this.line, {
      strokeStyle: this.options.strokeStyle,
      lineWidth: this.options.lineWidth
    });
    this.lastValue = 50;
    this.goalValue = 50;
    this.stopPulseLoop = false;
    this.pulseInterval = 1000;
    this.timeout = null;
    this.updateInterval = 10;
    this.step = 2;
  }
  delay(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  streamTo(canvas) {
    this.smoothieInstance.streamTo(canvas, this.updateInterval);
    let self = this;
    setInterval(() => self.gravitateTowardGoalValue(self), self.updateInterval);
    this.setBPM(60);
  }
  kick() {
    const intensity = this.getRandomInt(0, 10);
    const goal1 = 50 + intensity * 3 + 10; //this.getRandomInt(60, 80);
    const goal2 = 50 - intensity * 0.5 - 7; //this.getRandomInt(41, 43);
    //console.log({ goal1, goal2, first: goal1 - goalValue, second: goal1 - goal2 });
    this.goalValue = goal1;
    if (this.options.upBeatHook) this.options.upBeatHook();
    this.delay((goal1 - this.lastValue) * 3)
      .then(() => {
        this.goalValue = goal2;
        if (this.options.downBeatHook) this.options.downBeatHook();
      })
      .then(() => this.delay((goal1 - goal2) * 3))
      .then(() => {
        this.goalValue = 50;
      });
  }
  gravitateTowardGoalValue(self) {
    //console.log(this);
    const multiplier = self.lastValue > self.goalValue ? -1 : 1;
    if (Math.abs(self.lastValue - self.goalValue) < self.step) {
      self.lastValue = self.goalValue;
    }
    if (self.lastValue !== self.goalValue) {
      self.lastValue = self.lastValue + self.step * multiplier;
    }
    //console.log(this);
    this.line.append(new Date().getTime(), this.lastValue);
  }
  pulseLoop(self) {
    if (this.stopPulseLoop) return;
    self = self ? self : this;
    this.kick();
    this.timeout = setTimeout(() => self.pulseLoop(self), self.pulseInterval);
  }
  setBPM(val) {
    if (val === 0) {
      if (this.options.noHeartbeatHook)
        setTimeout(this.options.noHeartbeatHook, 100);
      this.stopPulseLoop = true;
      return;
    }
    if (val > 0 && this.stopPulseLoop) {
      this.stopPulseLoop = false;
      this.pulseInterval = 60000 / val;
      this.pulseLoop();
      return;
    }
    this.pulseInterval = 60000 / val;
    clearTimeout(this.timeout);
    this.pulseLoop();
  }
}
