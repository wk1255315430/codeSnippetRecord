import Vue from "vue";
import axios from "./utils/axios";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: ""
  },
  getters: {
    token(state) {
      return state.token;
    }
  },
  mutations: {
    _getToken(state, payload) {
      state.token = payload;
    },
    beforEunload(state, payload) {
      state.token = payload;
    }
  },
  actions: {
    getToken(context, payload) {
      return new Promise(resolve => {
        axios.post("/api/user/bmsl", payload).then(({ data: res }) => {
          if (res.status) {
            context.commit("_getToken", res.token);
            resolve(res);
          }
        });
      });
    }
  }
});
