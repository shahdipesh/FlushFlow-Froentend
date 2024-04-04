// store/modules/user.js
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const BASE_URL = 'https://flushflow.bsite.net'
// const BASE_URL = 'https://localhost:7256'

export default {
    namespaced: true,
    state() {
        return {
            user: null,
        };
    },
    mutations: {
        // Define your user-related mutations here
        // For example:
        SET_USER(state, user) {
            debugger;
            state.user = user;
        }
    },
    actions: {
        async login({ commit }, { email, password }) {
            return axios.post(`${BASE_URL}/api/user/login`,
                {
                    Email: email,
                    Password: password
                }).then((response) => {
                    if (response.status === 200) {
                        //if cookie is present then save it in cookie
                        commit('SET_USER', response.data);
                        localStorage.setItem('email', email);
                        localStorage.setItem('token', response.data.token);
                        return true;
                    }
                    return false;
                }).catch((error) => {
                    console.error(error);
                    return false;
                });
        },
        async register({commit}, { username, email, password, token }) {
            // Replace this with your actual API call
            return axios.post(`${BASE_URL}/api/user/register`,
                {
                    Username: username,
                    Email: email,
                    Password: password,
                    Token: token
                }).then((response) => {
                    debugger;
                    commit('SET_USER', response.data.user);
                    localStorage.setItem('email', email);
                    localStorage.setItem('token', response.data.token);
                    return response;
                }).catch((error) => {
                    console.error(error);
                    return error;
                });
        },
        async getCurrentLoggedInUser({ commit }) {
            return axios.post(`${BASE_URL}/api/user/getCurrentUser`, { email: localStorage.getItem('email'), token: localStorage.getItem('token') })
                .then((response) => {
                    commit('SET_USER', response.data);
                    return response;
                }).catch((error) => {
                    console.error(error);
                    return error;
                });
        },
        async sendToken(_, { email, password }) {
            return axios.post(`${BASE_URL}/api/user/sendToken`,
                {
                    Email: email,
                    Password: password
                }).then((response) => {
                    if (response.status === 200) {
                        return true;
                    }
                    return false;
                }).catch((error) => {
                    console.error(error);
                    return false;
                });
        },
        async logout({ commit }) {
            debugger;
            localStorage.removeItem('email');
            localStorage.removeItem('token');
            commit('SET_USER', null);
            router.push('/login');
        },

    },
    getters: {
        // Define your user-related getters here
        // For example:
        user: (state) => {
            return state?.user
        },
        username: (state) => {
            return state?.user?.username;
        },
        isWorkingThisWeek: (state) => {
            return state?.user?.isWorkingThisWeek;
        },
        email: (state) => {
            return state?.user?.email;
        },
        isLoggedIn: (state) => {
            return state?.user !== null;
        },

    },
};