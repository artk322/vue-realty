/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Post from './modules/post';
import Auth from './modules/auth';
import Profile from './modules/profile';
const url = `${process.env.VUE_APP_API}`;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    message: null,
    sidebarActive: false,
  },
  getters: {
    sidebarActive: s => s.sidebarActive,
    message: s => s.message,
  },
  mutations: {
    setMessage(state, value) {
      state.message = value;
    },
    clearMessage(state) {
      state.message = null;
    },
    toggleSidebar(state) {
      state.sidebarActive = !state.sidebarActive;
    },
  },
  actions: {
    async initializeApp({ commit }) {
      const jwt = localStorage.getItem('jwt') || null;
      if (jwt) {
        await axios
          .post(url + 'token', null, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          })
          .then(response => {
            commit('setUserData', response.data);
          })
          .catch(error => {
            commit('setMessage', { type: 'default', message: error.response.data.message });
          });
      }
    },
  },
  modules: { Post, Auth, Profile },
});
