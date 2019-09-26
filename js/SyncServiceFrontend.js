function getDeviceModel() {

  var browserName = "Mobile Device",
      deviceName = "Desktop",
      nUA = navigator.userAgent,
      fullName;

  if (nUA.search(/Safari/) != -1) {browserName = 'Safari'};
  if (nUA.search(/Firefox/) != -1) {browserName = 'MozillaFirefox'};
  if (nUA.search(/MSIE/) != -1 || nUA.search(/NET CLR /) != -1) {browserName = 'Internet Explorer'};
  if (nUA.search(/Chrome/) != -1) {browserName = 'Google Chrome'};
  if (nUA.search(/YaBrowser/) != -1) {browserName = 'Яндекс браузер'};
  if (nUA.search(/OPR/) != -1) {browserName = 'Opera'};
  if (nUA.search(/Konqueror/) != -1) {browserName = 'Konqueror'};
  if (nUA.search(/Iceweasel/) != -1) {browserName = 'Debian Iceweasel'};
  if (nUA.search(/SeaMonkey/) != -1) {browserName = 'SeaMonkey'};
  if (nUA.search(/Edge/) != -1) {browserName = 'Microsoft Edge'};

  if (nUA.search(/Android/) != -1) {deviceName = 'Android'};
  if (nUA.search(/webOS/) != -1) {deviceName = 'webOS'};
  if (nUA.search(/iPhone/) != -1) {deviceName = 'iPhone'};
  if (nUA.search(/iPad/) != -1) {deviceName = 'iPad'};
  if (nUA.search(/iPod/) != -1) {deviceName = 'iPod'};
  if (nUA.search(/BlackBerry/) != -1) {deviceName = 'BlackBerry'};
  if (nUA.search(/IEMobile/) != -1) {deviceName = 'IEMobile'};
  if (nUA.search(/Opera Mini/) != -1) {deviceName = 'Opera Mini'};

  fullName = browserName + ' ' +  deviceName;

  return '' + fullName;
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