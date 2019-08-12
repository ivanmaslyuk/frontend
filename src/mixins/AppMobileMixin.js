export default {
  data() {
    return {
      systemName: null
    };
  },

  mounted() {
    this.$syncService.addMessageListener("mobile-app", this.handleMessage);
    if (!this.systemName) {
      console.error("systemName is not defined");
    }
  },

  methods: {
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
        if (message.event === "device_disconnected") {
          return this.deviceDisconnected(
            payload.deviceType,
            payload.deviceName
          );
        }
        if (message.event === "device_connected") {
          return this.deviceConnected(payload.deviceType, payload.deviceName);
        }
      }
      if (message.source === this.systemName) {
        return this.handleEvent(message.event, message.payload);
      }
    }
  }
}