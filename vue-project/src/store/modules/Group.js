// store/modules/user.js
import axios from 'axios';
import store from '..';

// const BASE_URL = 'https://flushflow.bsite.net'
const BASE_URL = 'https://localhost:7256'

export default {
    namespaced: true,
    state() {
        return {
            groups: [],
        };
    },
    mutations: {
        SET_GROUPS(state, groups) {
            debugger;
            state.groups = groups;
        }
    },
    actions: {
        async getGroupsForCurrentUser({ commit, dispatch }) {
            await axios.get(`${BASE_URL}/api/group/getGroups?email=dipesh@gmail.com`).then(async (response) => {
                if (response.status === 200) {
                    debugger;
                    commit('SET_GROUPS', response.data);
                }
            }).catch((error) => {
                console.error('An error occurred:', error);
            });
        }

    },
    getters: {
        getGroups: (state) => {
            return state?.groups;
        }
    },
};