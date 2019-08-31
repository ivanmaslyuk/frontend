export default {
  data() {
    return {
      systemName: null
    };
  },

  mounted() {
    if (!this.systemName) {
      return console.error("systemName is not defined in app.");
    }
    this.$syncService.addMessageListener(
      `${this.systemName}-admin`,
      this.handleMessage
    );
  },

  destroyed() {
    if (this.systemName) {
      this.$syncService.removeMessageListener(`${this.systemName}-admin`);
    }
  },

  methods: {
    launch(args) {
      if (!this.systemName) {
        return console.error("systemName is not defined in app.");
      }
      this.$syncService.sendMessage({
        source: "device",
        event: "app_launched",
        payload: {
          name: this.systemName,
          args
        }
      });
    },

    sendMessage(event, payload) {
      this.$syncService.sendMessage({
        source: this.systemName,
        event,
        payload
      });
    },

    handleMessage(message) {
      if (message.source === "system") {
        const payload = message.payload;
        if (message.event === "device_disconnected" && this.deviceDisconnected) {
          return this.deviceDisconnected(
            payload.deviceType,
            payload.deviceName
          );
        }
        if (message.event === "device_connected" && this.deviceConnected) {
          return this.deviceConnected(payload.deviceType, payload.deviceName);
        }
      }
      if (message.source === this.systemName && this.handleEvent) {
        return this.handleEvent(message.event, message.payload);
      }
    }
  }
}