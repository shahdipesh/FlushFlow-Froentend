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
            amountOwed: null
        };
    },
    mutations: {
        // Define your user-related mutations here
        // For example:
        SET_AMOUNT_OWED(state, amountOwed) {
            state.amountOwed = amountOwed;
        },
        SET_TOTAL_EXPENSE(state, totalExpense) {
            state.totalExpense = totalExpense;
        },
        ADD_AMOUNT_OWED_BY_ALL(state, amount) {
            state.amountOwed.forEach((user) => {
                user.amount += amount;
            });
        },
        ADD_TOTAL_EXPENSE(state, amount) {
            debugger;
            state.totalExpense += amount;
        },
        DECREASE_TOTAL_EXPENSE(state, amount) {
            state.totalExpense -= amount;
        },

        UPDATE_AMOUNT_OWED_AFTER_SETTLE(state, { borrowerEmail }) {
            state.amountOwed.forEach((user) => {
                if (user.email === borrowerEmail) {
                    user.amount = 0;
                }
            });
        },
        SETTLE_BALANCE(state, borrowerEmail) {
            state.amountOwed.forEach((user) => {
                if (user.email === borrowerEmail) {
                    user.amount = 0;
                }
            });
        }
    },
    actions: {
        async getAmountsOwedToCurrentUser({ commit }) {
            return axios.get(`${BASE_URL}/api/transaction/getAmountsOwedToCurrentUser?currentUserEmail=${localStorage.getItem('email')}`)
                .then((response) => {
                    commit('SET_AMOUNT_OWED', response.data);
                    return response;
                }).catch((error) => {
                    console.error(error);
                });
        },

        async getTotalExpense({ commit }) {
            return axios.get(`${BASE_URL}/api/transaction/getTotalExpenses`)
                .then((response) => {
                    commit('SET_TOTAL_EXPENSE', response.data);
                    return response;
                }).catch((error) => {
                    console.error(error);
                });
        },

        async addTransaction({ commit }, { email, amount, reason }) {
            return axios.post(`${BASE_URL}/api/transaction/addTransaction`, { email, amount, reason })
                .then((response) => {
                    commit('ADD_TOTAL_EXPENSE', amount); // Removed extra closing parenthesis
                    commit('ADD_AMOUNT_OWED_BY_ALL', response.data);
                    return response;
                }).catch((error) => {
                    console.error(error);
                });
        },

        async settleUp({ commit, dispatch }, { borrowerEmail }) {
            debugger;
            return axios.post(`${BASE_URL}/api/transaction/settleBalance`, { ownerEmail: localStorage.email, borrowerEmail })
                .then((response) => {
                    commit('DECREASE_TOTAL_EXPENSE', response.data);
                    commit('UPDATE_AMOUNT_OWED_AFTER_SETTLE', { borrowerEmail });
                    return response;
                }).catch((error) => {
                    console.error(error);
                });
        },

        async sendReminder({ commit }, { borrowerEmail }) {
            return axios.post(`${BASE_URL}/api/transaction/sendReminderEmail`, { ownerEmail: localStorage.email, borrowerEmail })
                .then((response) => {
                    return response;
                }).catch((error) => {
                    console.error(error);
                });
        }

    },
    getters: {
        getAmountOwedByAll(state) {

            return state.amountOwed;
        },
        getTotalExpense(state) {
            return state.totalExpense;
        }
    },
};