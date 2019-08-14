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
import { mapState, mapMutations } from "vuex";
import router from "../router";

export default {
  name: "home",
  data() {
    return {
      apps: []
    };
  },

  async mounted() {
    if (!this.sessionId) {
      if (localStorage.accessToken) {
        this.$syncService.connect("admin_console", (payload, err) => {
          if (err) {
            return console.log(err);
          }
          this.setSessionId(payload.sessionId);
        });
      } else {
        return router.replace({ name: "login" });
      }
    }

    try {
      const basePath = this.backendBasePath();
      const response = await axios.get(`${basePath}/api/apps`);
      this.apps = response.data;
    } catch (err) {
      console.log(err);
    }
  },

  computed: mapState(["sessionId"]),
  methods: mapMutations(["setSessionId"])
};
</script>
