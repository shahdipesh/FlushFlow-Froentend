// store/modules/user.js
import axios from 'axios';

const BASE_URL = 'https://flushflow.bsite.net'

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
        },
    },
    actions: {
        async login({commit}, { email, password }){
            const response = await axios.post(`${BASE_URL}/api/user/login`,
            {
                Email:email,
                Password:password
            });

            if(response.status === 200) {
                commit('SET_USER', response.data);
                return true;
            }
        },
        async register(_, { username, email, password }) {
            try {
              // Replace this with your actual API call
              const response = await axios.post(`${BASE_URL}/api/user/register`,
                {
                    Username:username,
                    Email:email,
                    Password:password
                });

              if(response.status === 200) {
                return true;
              }

            } catch (error) {
              // Handle the error
              console.error(error);
              return false;
            }
        }

    },
    getters: {
        // Define your user-related getters here
        // For example:
        user: (state) => {
            return state.user
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