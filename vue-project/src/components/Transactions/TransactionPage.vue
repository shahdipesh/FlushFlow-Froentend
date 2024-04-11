<template>
    <div class="flex flex-column justify-content-center align-items-center w-full mt-4">
        <div class="flex text-2xl w-full">
            <div class="flex justify-content-center align-items-center w-full">
                <p class="text-md underline">Account Summary for {{ currentLoggedInUser }}</p>
            </div>
        </div>
        <div  class="flex flex-column justify-content-center align-content-center w-full mb-5" v-if="!isLoadingTransactionHistoryBetnUsers">
            <div>
                <div class="flex flex-column justify-content-end align-content-center w-full">
                    <account-infos @borrowerClicked="handleBorrowerClicked"/>
                </div>
            </div>
        </div>
        <div v-else>
            <ProgressSpinner />
        </div>
        <Button class="mr-2" @click="showDialog = true" severity="primary" label="Add a new Transaction" />
        <Button class="mt-3" @click="handleShowExpenseHistoryDialog" severity="warning" label="Show Expense Log for this month" />
    </div>
    <AddExpenseDialog :isTransactionSaveInProgress="isTransactionSaveInProgress" :visible="showDialog"
        @hideDialog="showDialog = false" @saveTransaction="handleTransactionSave" />
    <expense-history-dialog :visible="showExpenseHistoryDialog" @hideDialog="showExpenseHistoryDialog = false" />
    <user-expense-dialog
        @remindAboutIncorrectTransaction="reportIncorrectTransaction"
        @customUserTransactionDeleted="handleCustomTransactionDelete"
        :expenseHistoryBetweenTwoUsers= "expenseHistoryBetweenTwoUsers"
        :selectedUserEmail="currentSelectedUserEmail"
        :selectedUserUsername="currentSelectedUserUsername"
        :visible="showUserExpenseDialog"
        @hideDialog="showUserExpenseDialog = false" />

</template>


<script setup>
import AccountInfos from './AmountInfos.vue'
import AddExpenseDialog from '../Dialog/AddExpenseDialog.vue'
import ExpenseHistoryDialog from '../Dialog/ExpenseHistoryDialog.vue'
import UserExpenseDialog from '../Dialog/UserExpenseDialog.vue'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import ProgressSpinner from 'primevue/progressspinner';


const store = useStore();

let isTransactionSaveInProgress = ref(false);

let currentSelectedUserEmail = ref('');
let currentSelectedUserUsername = ref('');

let showUserExpenseDialog = ref(false);

let isLoadingTransactionHistoryBetnUsers =  ref(true);

let currentLoggedInUser = computed(() => {
    return store.getters['User/username']
});

let  expenseHistoryBetweenTwoUsers = computed(() => {
    return store.getters['Transaction/getCurrentTransactionBetweenSelectedUsers']
});

let totalExpense = computed(() => {
    return store.getters['Transaction/getTotalExpense']
});

let handleCustomTransactionDelete = ({id, borrowerEmail}) => {
    // store.dispatch('Transaction/getTransactionsBetweenTwoUsers', {borrowerEmail}).then((res) => {
    //     showUserExpenseDialog.value = true;
    //      expenseHistoryBetweenTwoUsers.value = res.data;
    // });
}

const handleShowExpenseHistoryDialog = () => {
    store.dispatch('Transaction/getAllTransactionsForThisMonth');
    showExpenseHistoryDialog.value = true;
}

let handleBorrowerClicked = (email, name) => {
    currentSelectedUserEmail.value = email;
    currentSelectedUserUsername.value = name;
    store.dispatch('Transaction/getTransactionsBetweenTwoUsers', {borrowerEmail:email}).then((res) => {
        showUserExpenseDialog.value = true;
         expenseHistoryBetweenTwoUsers.value = res.data;
    });
}

let reportIncorrectTransaction = (id, targetEmail, reporter) => {
    store.dispatch('Transaction/reportIncorrectTransaction', {id,targetEmail,reporter}).then((res) => {
        alert('Email sent to the user about this incorrect transaction');
    }).catch(() => {
        alert('Failed to notify user about incorrect transaction');
    });
}

let users = computed(() => {
    return store.getters['Transaction/getAllUsers']
});

let showDialog = ref(false);
let showExpenseHistoryDialog = ref(false);

let handleTransactionSave = ({ selectedUserEmails, amount, description }) => {
        isTransactionSaveInProgress.value = true;
        store.dispatch('Transaction/addCustomTransaction', { emails: selectedUserEmails, ownerEmail: localStorage.email, ownerUsername: localStorage.username , amount, description }).then((res) => {
            isTransactionSaveInProgress.value = false;
            showDialog.value = false;
        }).catch(() => {
            alert('Failed to save transaction');
            isTransactionSaveInProgress.value = false;
        });
}

onMounted(() => {
    isLoadingTransactionHistoryBetnUsers.value = true;
    store.dispatch('Transaction/getAmountsOwedToCurrentUser').then(res => {
        isLoadingTransactionHistoryBetnUsers.value = false;
    });
    store.dispatch('Transaction/getTotalExpense');
})

</script>
