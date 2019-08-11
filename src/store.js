import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sessionId: null
  },
  mutations: {
    setSessionId(state, val) {
      state.sessionId = val;
    }
  },
  actions: {}
});
