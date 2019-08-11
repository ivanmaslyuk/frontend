function getDeviceModel() {
  return "Mobile Device";
}

/******************************* PRIVATE MEMBERS *******************************/

function _handleWSMessage(message) {
  if (message.source === "system" && message.event === "access_granted") {
    if (this.handshakeCallback) {
      this.handshakeCallback(message.payload || {});
    }
    return;
  }

  if (message.source === "system" && message.event === "access_denied") {
    if (message.payload.reason === "Invalid session identifier.") {
      if (this.handshakeCallback) {
        this.handshakeCallback(undefined, "WRONG_SESSION_ID");
      }
      return;
    }
  }

  if (message.source === "system" && message.event === "session_terminated") {
    if (this.onSessionTerminated) {
      this.onSessionTerminated();
    }
    return;
  }

  _notifyMessage.call(this, message);
}

function _performHandshake(deviceType, sessionId) {
  var handshakeMessage = {
    source: "device",
    event: "handshake",
    payload: {
      deviceType
    }
  };

  if (deviceType === "mobile") {
    if (!sessionId) {
      return console.error(
        "No session id was passed. Cannot perform handshake."
      );
    }

    handshakeMessage.payload.sessionId = sessionId;
    handshakeMessage.payload.deviceModel = getDeviceModel();
  }

  if (deviceType === "projector") {
    if (!sessionId) {
      return console.error(
        "No session id was passed. Cannot perform handshake."
      );
    }

    handshakeMessage.payload.sessionId = sessionId;
  }

  if (deviceType === "admin_console") {
    var accessToken = localStorage.accessToken;
    if (!accessToken) {
      return console.error(
        "No access token found in cookies. Cannot perform handshake."
      );
    }

    handshakeMessage.payload.accessToken = accessToken;
  }

  var messageString = JSON.stringify(handshakeMessage);
  this.socket.send(messageString);
}

function _notifyMessage(msg) {
  for (const key in this.onMessageCallbacks) {
    this.onMessageCallbacks[key](msg);
  }
}

/******************************* CLASS DEFINITION *******************************/
export default class SyncServiceFrontend {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.onMessageCallbacks = {};
    this.onSessionTerminated = null;
    this.onConnectionError = null;
    this.handshakeCallback = null;
    this.socket = null;
  }

  connect(deviceType, callback, sessionId) {
    this.handshakeCallback = callback;
    try {
      this.socket = new WebSocket(`ws://${this.host}:${this.port}`);
    } catch (err) {
      if (this.onConnectionError) {
        this.onConnectionError();
      }
    }
    this.socket.onopen = () =>
      _performHandshake.call(this, deviceType, sessionId);
    this.socket.onmessage = event =>
      _handleWSMessage.call(this, JSON.parse(event.data));
    this.socket.onerror = () => {
      console.error("WS CONNECTION ERROR");
      if (this.onConnectionError) {
        this.onConnectionError();
      }
    };
    this.socket.onclose = () => console.error("WS CLOSED");
  };

  /**
   * Отправляет сообщение серверу от имени запущенного приложения.
   * @param {string} event Имя события.
   * @param {object} payload Аргументы события.
   */
  sendMessage(message) {
    // вызвать callback с аргументами (succeeded)
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    }
  };

  isConnected() {
    return this.socket && this.socket.readyState == WebSocket.OPEN;
  };

  addMessageListener(name, callback) {
    this.onMessageCallbacks[name] = callback;
  };

  removeMessageListener(name) {
    delete this.onMessageCallbacks[name];
  };

}