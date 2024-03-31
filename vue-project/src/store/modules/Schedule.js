// store/modules/user.js
import axios from 'axios';
import store from '..';

const BASE_URL = 'https://flushflow.bsite.net'

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
        }
    },
    actions: {
        async findScheduledUser({ commit, dispatch}) {
            try {
                const response = await axios.get(`${BASE_URL}/api/schedule/whoseTurn`);
                if(response.status === 200) {
                    await commit('SET_SCHEDULED_USER', response.data);
                    // get current user email from store
                    const user = store.getters['User/user'];
                    const email = user.email;
                    // get current schedule id from store
                    const scheduleId = store.getters['Schedule/getCurrentScheduleId'];
                    // check if user has approved the task
                    await dispatch('didUserApproveTask', {email, scheduleId});
                    return response.data;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async requestApproval(_,  scheduleId ){
            const response = await axios.post(`${BASE_URL}/api/schedule/initiateTaskCompletion?scheduleId=${scheduleId}`);
            if(response.data){
                return true;
            }
            return false;
        },
        async approveChore(_,  {email, scheduleId} ){
            const response = await axios.post(`${BASE_URL}/api/schedule/approveTask?email=${email}&scheduleId=${scheduleId}`);
            if(response){
                return true;
            }
            return false;
        },
        async didUserApproveTask({ commit }, { email, scheduleId }) {
            try {
              const response = await axios.get(`${BASE_URL}/api/schedule/hasUserApproved?email=${email}&scheduleId=${scheduleId}`);
              
              if (response.status === 200) {
                commit('SET_DID_USER_APPROVE_TASK', true);
                return true;
              } else {
                commit('SET_DID_USER_APPROVE_TASK', false);
                return false;
              }
            } catch (error) {
              console.error('An error occurred:', error);
              commit('SET_DID_USER_APPROVE_TASK', false);
              return false;
            }
          }
    },
    getters: {
        getScheduledUser: (state) => {
            return state.scheduledUser;
        },
        getCurrentScheduledUserEmail: (state) => {
            return state.scheduledUser?.email;
        },
        getCurrentScheduleId: (state) => {
            return state.scheduledUser?.scheduleId;
        },
        getDidUserApproveTask: (state) => {
            return state.didUserApproveTask;
        }
    },
};