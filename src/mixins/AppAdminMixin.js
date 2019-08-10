export default {
  data() {
    return {
      systemName: undefined
    }
  },

  mounted() {
    window.syncService.addMessageListener("admin-app", this.handleMessage);
    window.syncService.sendMessage({
      source: "device",
      event: "app_launched",
      payload: {
        name: this.systemName
      }
    });
  },

  methods: {
    sendMessage(event, payload) {
      window.syncService.sendMessage({
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