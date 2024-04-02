// store/modules/user.js
import axios from 'axios';
import store from '..';

const BASE_URL = 'https://flushflow.bsite.net'

// const BASE_URL = 'https://localhost:7256'

export default {
    namespaced: true,
    state() {
        return {
            scheduledUser: null,
        };
    },
    mutations: {
        SET_SCHEDULED_USER(state, user) {
            state.scheduledUser = user;
        },
        SET_DID_USER_APPROVE_TASK(state, didUserApproveTask) {
            state.didUserApproveTask = didUserApproveTask;
        },
        SET_HAS_ALREADY_REQUESTED_APPROVAL(state, hasAlreadyRequestedApproval) {
            state.scheduledUser.hasRequestedApproval = hasAlreadyRequestedApproval;
        },
        SET_TASK_AS_COMPLETED(state) {
            state.scheduledUser.status = 'C';
        }
    },
    actions: {
        async findScheduledUser({ commit, dispatch }) {
                await axios.get(`${BASE_URL}/api/schedule/whoseTurn`).then(async (response) => {
                    if (response.status === 200) {
                        await commit('SET_SCHEDULED_USER', response.data);
                        // get current user email from store
                        const user = store.getters['User/user'];
                        const email = user.email;
                        // get current schedule id from store
                        const scheduleId = 24;
                        // check if user has approved the task
                        dispatch('didUserApproveTask', { email, scheduleId });
                        return response.data;
                    }
                }).catch((error) => {
                    console.error('An error occurred:', error);
                });
        },
        async requestApproval({ commit, dispatch }, scheduleId) {
            axios.post(`${BASE_URL}/api/schedule/initiateTaskCompletion?scheduleId=${scheduleId}`)
                .then(response => {
                    if (response.data) {
                        dispatch('setHasAlreadyRequestedApproval');
                        return true;
                    }
                    return false;
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                    return false;
                });
        },
        async approveChore({ commit, dispatch }, { email, scheduleId }) {
            return axios.post(`${BASE_URL}/api/schedule/approveTask?email=${email}&scheduleId=${scheduleId}`)
                .then(response => {
                    if (response.status === 200) {
                        dispatch('setTaskAsApproved');
                        if(response.data.taskStatus == 'C'){
                            commit('SET_TASK_AS_COMPLETED');
                        }
                        return true;
                    }
                    return false;
                })
                .catch(error => {
                    console.error('An error occurred:', error);
                    return false;
                });
        },
        async didUserApproveTask({ commit }, { email, scheduleId }) {
            await axios.get(`${BASE_URL}/api/schedule/hasUserApproved?email=${email}&scheduleId=${scheduleId}`)
            .then((response) => {
                if (response.status === 200) {
                    commit('SET_DID_USER_APPROVE_TASK', true);
                    return true;
                }
            }).catch(error => {
                console.error('An error occurred:', error);
                commit('SET_DID_USER_APPROVE_TASK', false);
                return false;
            });
        },
        setTaskAsApproved({ commit }) {
            commit('SET_DID_USER_APPROVE_TASK', true);
        },
        setHasAlreadyRequestedApproval({ commit }) {
            commit('SET_HAS_ALREADY_REQUESTED_APPROVAL', 1);
        }

    },
    getters: {
        getScheduledUser: (state) => {
            return state?.scheduledUser;
        },
        getCurrentScheduledUserEmail: (state) => {
            return state?.scheduledUser?.email;
        },
        getCurrentScheduleId: (state) => {
            return state?.scheduledUser?.scheduleId;
        },
        getDidUserApproveTask: (state) => {
            return state?.didUserApproveTask;
        },
        getHasAlreadyRequestedApproval: (state) => {
            return state?.scheduledUser?.hasRequestedApproval;
        },
        getIsCurrentTaskCompleted: (state) => {
            return state?.scheduledUser?.status == 'C';
        }
    },
};