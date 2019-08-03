<template>
  <div class="home">
    <p>Сессия: {{ sessionId }}</p>
    <div v-for="app in apps" v-bind:key="app._id">
      <a :href="'#/app/' + app._id">{{ app.humanName }}</a>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "home",
  data() {
    return {
      apps: [],
      sessionId: window.sessionId
    };
  },
  mounted() {
    axios
      .get("http://127.0.0.1:8080/api/apps")
      .then(response => {
        this.apps = response.data;
      })
      .catch(err => console.log(err));

    if (!window.syncService) {
      window.syncService = new SyncServiceFrontend("localhost", 3001);
      window.syncService.connect((payload, err) => {
        window.sessionId = payload.sessionId;
        this.sessionId = payload.sessionId;
      });
      window.syncService.onMessage = console.log;
    }
  }
};
</script>
