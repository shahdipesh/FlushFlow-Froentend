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
            amountOwed: null,
            amountOwedInGroup: null,
        };
    },
    mutations: {
        // Define your user-related mutations here
        // For example:
        SET_AMOUNT_OWED(state, amountOwed) {
            state.amountOwed = amountOwed;
        },
        SET_AMOUNT_OWED_IN_GROUP(state, amountOwed) {
            state.amountOwedInGroup = amountOwed;
        },
        SET_TOTAL_EXPENSE(state, totalExpense) {
            state.totalExpense = totalExpense;
        },
        ADD_AMOUNT_OWED_BY_ALL(state, amount) {
            state.amountOwed.forEach((user) => {
                user.amount += amount;
            });
        },
        UPDATE_AMOUNT_OWED_BY_USERS(state, { emails, amount }) {
            state.amountOwed.forEach((user) => {
                if (emails.includes(user.email)) {
                    user.amount += amount;
                }
            });
        },
        ADD_TOTAL_EXPENSE(state, amount) {

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
        },
        SET_ALL_TRANSACTIONS(state, transactions) {

            state.transactions = transactions;
        },
        SET_USERS(state, users) {
            state.users = users;
        },
        SET_CURRENT_TRANSACTION_BETWEEN_SELECTED_USERS(state, transactions) {
            state.currentTransactionBetweenSelectedUsers = transactions;
        },
        UPDATE_AMOUNT_OWED_AFTER_DELETE(state, { borrowerEmail, amount }) {
            state.amountOwed.forEach((user) => {
                if (user.email === borrowerEmail) {
                    user.amount -= amount;
                }
            });
        },
        // UPDATE_AMOUNT_OWED_AFTER_DELETE_GROUP_TRANSACTION(state, { amount }) {
        //     state.amountOwed.forEach((user) => {
        //         user.amount -= amount;
        //     });
        // }
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
        async getAmountsOwedToCurrentUserInGroup({ commit }, groupId) {
            return axios.get(`${BASE_URL}/api/transaction/getAmountOwedToCurrentUserInGroup?currentUserEmail=${localStorage.getItem('email')}&groupId=${groupId}`)
                .then((response) => {
                    commit('SET_AMOUNT_OWED_IN_GROUP', response.data);
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

        async addTransaction({ commit }, { email, username, amount, description, groupId }) {
            return axios.post(`${BASE_URL}/api/transaction/addTransaction`, { email, username, amount, reason: description, groupId })
                .then((response) => {
                    commit('ADD_TOTAL_EXPENSE', amount); // Removed extra closing parenthesis
                    commit('ADD_AMOUNT_OWED_BY_ALL', response.data);
                    return response;
                }).catch((error) => {
                    console.error(error);
                });
        },

        async settleUp({ commit, dispatch }, { borrowerEmail }) {

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
        },

        async getAllTransactionsForThisMonth({ commit }) {

            return axios.get(`${BASE_URL}/api/transaction/getAllTransactionsForThisMonth`)
                .then((response) => {
                    commit('SET_ALL_TRANSACTIONS', response.data);
                    return response;
                }).catch((error) => {
                    console.error(error);
                });
        },


        async addCustomTransaction({ commit }, { emails, ownerEmail, ownerUsername, amount, description, groupId }) {
            return axios.post(`${BASE_URL}/api/transaction/addCustomTransaction`, { emails, ownerEmail,ownerUsername, amount, description, groupId })
                .then((response) => {
                    let perUserAmount = amount / (emails.length+1);
                    commit('UPDATE_AMOUNT_OWED_BY_USERS', { emails, amount:perUserAmount });
                    return response;
                }).catch((error) => {
                    console.error(error);
                });
        },

        async getTransactionsBetweenTwoUsers({ commit}, { borrowerEmail }) {
            let ownerEmail = localStorage.email;
            return axios.get(`${BASE_URL}/api/transaction/getTransactionBetweenUsers?ownerEmail=${ownerEmail}&borrowerEmail=${borrowerEmail}`)
                .then((response) => {
                    commit('SET_CURRENT_TRANSACTION_BETWEEN_SELECTED_USERS', response.data);
                    return response;
                }).catch((error) => {
                    console.error(error);
                    return error;
                });
        },

        async deleteTransactionCustom({ commit },{id, borrowerEmail}) {
            return axios.delete(`${BASE_URL}/api/transaction/deleteTransactionCustom?id=${id}`)
                .then((response) => {
                    commit('UPDATE_AMOUNT_OWED_AFTER_DELETE', { borrowerEmail, amount:response.data.amount });
                    commit('getTransactionsBetweenTwoUsers', { borrowerEmail });
                    return response;
                }).catch((error) => {
                    console.error(error);
                    return error;
                });
        },

        async deleteTransactionGroup({ commit,dispatch },  id ) {
            return axios.delete(`${BASE_URL}/api/transaction/deleteTransactionGroup?id=${id}`)
                .then((response) => {
                    window.location.reload();
                    return response;
                }).catch((error) => {
                    console.error(error);
                    return error;
                });
        },

        async reportIncorrectTransaction({ commit }, { id, targetEmail, reporter=localStorage.email }) {
            return axios.post(`${BASE_URL}/api/transaction/reportIncorrectTransaction`, { id, targetEmail, reporter})
                .then((response) => {
                    return response;
                }).catch((error) => {
                    console.error(error);
                    return error;
                });
        },

        async getAllUsers({ commit}) {
            return axios.get(`${BASE_URL}/api/user/allUsers`)
                .then((response) => {
                    commit('SET_USERS', response.data);
                    return response;
                }).catch((error) => {
                    console.error(error);
                    return error;
                });
        }

    },
    getters: {
        getAmountOwedByAll(state) {
            return state.amountOwed;
        },
        getAmountOwedByAllInGroup(state) {
            return state.amountOwedInGroup;
        },
        getTotalExpense(state) {
            return state.totalExpense;
        },
        getAllTransactionsForThisMonth(state) {

            return state.transactions;
        },
        getAllUsers(state) {
            return state.users;
        },
        getCurrentTransactionBetweenSelectedUsers(state) {
            return state.currentTransactionBetweenSelectedUsers;
        }
    },
};