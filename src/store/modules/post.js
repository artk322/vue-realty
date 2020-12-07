/* eslint-disable no-unused-vars */
import axios from 'axios';
const url = `${process.env.VUE_APP_API}`;

export default {
  state: {
    posts: [],
    searchString: '',
    currentMapData: null,
  },
  getters: {
    posts: state => state.posts,
    postById: state => pid => state.posts.find(p => p.pid === pid),
    userPosts: state => uid => state.posts.filter(p => p.owner_uid === uid),
    searchString: state => state.searchString,
    hots: state => state.posts.filter(p => p.hot),
    currentMapData: state => state.currentMapData,
  },
  mutations: {
    setPosts(state, payload) {
      state.posts = payload;
    },
    toSearch(state, payload) {
      state.searchString = payload;
    },
    setCurrentMapData(state, payload) {
      state.currentMapData = payload;
    },
    clearCurrentMapData(state) {
      state.currentMapData = null;
    },
  },
  actions: {
    async fetchPosts({ commit }) {
      await axios
        .get(url + 'posts')
        .then(response => {
          commit('setPosts', response.data.posts);
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async createPost({ commit }, payload) {
      await axios
        .post(url + 'create-post', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(response => {
          commit('setMessage', { type: 'success', message: response.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async updatePost({ commit }, payload) {
      await axios
        .put(url + 'update-post', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(response => {
          commit('setMessage', { type: 'success', message: response.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async deletePost({ commit }, payload) {
      await axios
        .post(url + 'delete-post', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        })
        .then(response => {
          commit('setMessage', { type: 'success', message: response.data.message });
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
    async fetchGeometry({ commit }, payload) {
      await axios
        .post(url + 'fetch-geometry', payload)
        .then(response => {
          commit('setCurrentMapData', response.data);
        })
        .catch(error => {
          commit('setMessage', { type: 'error', message: error.response.data.message });
        });
    },
  },
};
