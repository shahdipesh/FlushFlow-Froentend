// store/modules/user.js
import axios from 'axios';

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
            state.user = user;
        }
    },
    actions: {
        async login({commit}, { email, password }){
            return axios.post(`${BASE_URL}/api/user/login`,
            {
                Email:email,
                Password:password
            }).then((response) => {
                if(response.status === 200) {
                    commit('SET_USER', response.data);
                    return true;
                }
                return false;
            }).catch((error) => {
                console.error(error);
                return false;
            });
        },
        async register(_, { username, email, password }) {
              // Replace this with your actual API call
            return axios.post(`${BASE_URL}/api/user/register`,
                {
                    Username:username,
                    Email:email,
                    Password:password
                }).then((response) => {
                    if(response.status === 200) {
                        return true;
                    }
                    return false;
                }).catch((error) => {
                    console.error(error);
                    return false;
            });
        },
        async logout({commit}){
            commit('SET_USER', null);
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

    },
};