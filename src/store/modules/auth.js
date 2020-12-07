import axios from 'axios';
const url = `${process.env.VUE_APP_API}`;

export default {
  state: {
    userData: null,
  },
  getters: {
    userData: state => state.userData,
  },
  mutations: {
    setUserData(state, payload) {
      if (payload) {
        state.userData = payload.user;
        localStorage.setItem('user', JSON.stringify(payload.user));
      }
    },
    clearUserData(state) {
      state.userData = {};
      localStorage.removeItem('user');
      localStorage.removeItem('jwt');
    },
  },
  actions: {
    async registerUser({ commit }, data) {
      await axios
        .post(url + 'register', data)
        .then(res => {
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async login({ commit }, payload) {
      await axios
        .post(url + 'login', payload)
        .then(res => {
          localStorage.setItem('jwt', res.data.accessToken);
          commit('setUserData', res.data);
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async logout({ commit }) {
      await axios
        .post(url + 'logout')
        .then(res => {
          commit('clearUserData');
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async updateUser({ commit }, payload) {
      await axios
        .put(url + 'updateUser', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(res => {
          localStorage.setItem('jwt', res.data.accessToken);
          commit('setUserData', res.data);
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async deleteUser({ commit }, payload) {
      await axios
        .post(url + 'deleteUser', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(res => {
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async verifyEmail({ commit }, payload) {
      await axios
        .post(url + 'verifyEmail', payload)
        .then(res => {
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async sendRecoveryEmail({ commit }, payload) {
      await axios
        .post(url + 'sendRecoveryEmail', payload)
        .then(res => {
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async resetPassword({ commit }, payload) {
      await axios
        .put(url + 'resetPassword', payload)
        .then(res => {
          commit('setMessage', { type: 'success', message: res.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
  },
};
