// store/modules/user.js
import axios from 'axios';
import store from '..';

const BASE_URL = 'https://flushflow.bsite.net'
// const BASE_URL = 'https://localhost:7256'

export default {
    namespaced: true,
    state() {
        return {
            groups: [],
            users: [],
            currentGroupInfo: null
        };
    },
    mutations: {
        SET_GROUPS(state, groups) {
            state.groups = groups;
        },
        SET_USERS(state, users) {
            state.users = users;
        },
        SET_CURRENT_GROUP_INFO(state, groupInfo) {
            state.currentGroupInfo = groupInfo;
        }
    },
    actions: {
        async getGroupsForCurrentUser({ commit, dispatch }) {
            await axios.get(`${BASE_URL}/api/group/getGroups?email=${localStorage.email}`).then(async (response) => {
                if (response.status === 200) {
                    commit('SET_GROUPS', response.data);
                }
            }).catch((error) => {
                console.error('An error occurred:', error);
            });
        },
        async getAllUsers({ commit }, groupId) {
            await axios.get(`${BASE_URL}/api/group/getUsersInGroup?groupId=${groupId}`).then(async (response) => {
                if (response.status === 200) {
                    commit('SET_USERS', response.data);
                }
            }).catch((error) => {
                console.error('An error occurred:', error);
            });
        },
        async createGroup({ commit, dispatch }, {name, owner}) {
            await axios.post(`${BASE_URL}/api/group/createGroup`, {name, ownerEmail:owner}).then(async (response) => {
                if (response.status === 200) {
                    dispatch('getGroupsForCurrentUser');
                }
            }).catch((error) => {
                console.error('An error occurred:', error);
            });
        },
        async getGroupInfo({ commit, dispatch }, groupId) {
            await axios.get(`${BASE_URL}/api/group/getGroupInfo?groupId=${groupId}`).then((response) => {
                if (response.status === 200) {
                    commit('SET_CURRENT_GROUP_INFO', response.data);
                    return response;
                }
            }).catch((error) => {
                console.error('An error occurred:', error);
            });
        },
        async addUserToGroup({ commit, dispatch }, {groupId, email}) {
            await axios.post(`${BASE_URL}/api/group/addUserToGroup`, {groupId, email}).then(async (response) => {
                if (response.status === 200) {
                    await dispatch('getAllUsers', groupId);
                }
            }).catch((error) => {
                console.error('An error occurred:', error);
            });
        },

    },
    getters: {
        getGroups: (state) => {
            return state?.groups;
        },
        getAllUsers(state) {
            return state.users;
        },
        getCurrentGroupInfo(state) {
            return state.currentGroupInfo;
        }
    },
};