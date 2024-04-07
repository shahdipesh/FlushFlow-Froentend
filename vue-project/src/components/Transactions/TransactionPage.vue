<template>
    <div class="flex flex-column justify-content-center align-items-center w-full mt-4">
        <div class="flex text-2xl w-full">
            <div class="flex justify-content-center align-items-center w-full">
                Account Summary
            </div>
        </div>
        <div class="flex flex-column justify-content-center align-content-center w-full mb-5">
            <div class="flex flex-column justify-content-end align-content-center w-full">
                <account-infos @borrowerClicked="handleBorrowerClicked"/>
            </div>
        </div>
        <Button class="mr-2" @click="showDialog = true" severity="primary" label="Add a new Transaction" />
        <Button class="mt-3" @click="showExpenseHistoryDialog = true" severity="warning"
            label="Show Expense Log for this month" />
    </div>
    <AddExpenseDialog :isTransactionSaveInProgress="isTransactionSaveInProgress" :visible="showDialog"
        @hideDialog="showDialog = false" @saveTransaction="handleTransactionSave" />
    <expense-history-dialog :visible="showExpenseHistoryDialog" @hideDialog="showExpenseHistoryDialog = false" />
    <user-expense-dialog :expenseHistoryBetweenTwoUsers=" expenseHistoryBetweenTwoUsers" :selectedUserEmail="currentSelectedUser" :visible="showUserExpenseDialog" @hideDialog="showUserExpenseDialog = false" />

</template>


<script setup>
import AccountInfos from './AmountInfos.vue'
import AddExpenseDialog from '../Dialog/AddExpenseDialog.vue'
import ExpenseHistoryDialog from '../Dialog/ExpenseHistoryDialog.vue'
import UserExpenseDialog from '../Dialog/UserExpenseDialog.vue'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore();

let isTransactionSaveInProgress = ref(false);

let currentSelectedUser = ref('Dipesh');

let showUserExpenseDialog = ref(false);

let  expenseHistoryBetweenTwoUsers = ref([]);

let totalExpense = computed(() => {
    return store.getters['Transaction/getTotalExpense']
});

let handleBorrowerClicked = (email) => {
    currentSelectedUser.value = email;
    store.dispatch('Transaction/getTransactionsBetweenTwoUsers', {borrowerEmail:email}).then((res) => {
        debugger;
        showUserExpenseDialog.value = true;
         expenseHistoryBetweenTwoUsers.value = res.data;
    });
}

let users = computed(() => {
    return store.getters['Transaction/getAllUsers']
});

let showDialog = ref(false);
let showExpenseHistoryDialog = ref(false);

let handleTransactionSave = ({ selectedUserEmails, amount, description }) => {
        isTransactionSaveInProgress.value = true;
        debugger;
        store.dispatch('Transaction/addCustomTransaction', { emails: selectedUserEmails, ownerEmail: localStorage.email, ownerUsername: localStorage.username , amount, description }).then((res) => {
            isTransactionSaveInProgress.value = false;
            showDialog.value = false;
        }).catch(() => {
            alert('Failed to save transaction');
            isTransactionSaveInProgress.value = false;
        });
}

onMounted(() => {
    store.dispatch('Transaction/getAmountsOwedToCurrentUser');
    store.dispatch('Transaction/getTotalExpense');

})

</script>
