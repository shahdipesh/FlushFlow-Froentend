<template>
    <div v-if="shouldShowInvitePeersButton">
        <div class="flex justify-content-end align-items-center w-full mt-4">
            <Button class="mr-2" @click="showInviteDialog = true" severity="contrast" label="Invite Peers to Group" />
        </div>
        <div class="overlay" v-if="showInviteDialog" @click="showInviteDialog = false">
            <Dialog class="dialog" :closable="false" v-model:visible="showInviteDialog" header="Invite peers to group">
                <div class="flex align-items-center gap-3 mb-5">
                    <label for="Email" class="flex flex-1 font-semibold">Email</label>
                    <InputText class="flex" v-model="email" id="Email" />
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary"
                        @click="showInviteDialog = false"></Button>
                    <Button :disabled="shouldDisableSave" :loading="isTransactionSaveInProgress" type="button"
                        label="Invite" @click="handleInvite"></Button>
                </div>
            </Dialog>
        </div>
    </div>
    <div v-if="usersInGroup.length == 1">
        <div class="flex flex-column justify-content-center align-items-center w-full mt-4">
            <div class="flex text-2xl w-full">
                <div class="flex justify-content-center align-items-center w-full">
                    <p class="text-md underline">No Peers In Group.</p>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex flex-column justify-content-center align-items-center w-full mt-4">
        <div class="flex text-2xl w-full">
            <div class="flex justify-content-center align-items-center w-full">
                <p class="text-md underline">Account Summary for {{ currentLoggedInUser }}</p>
            </div>
        </div>
        <div class="flex flex-column justify-content-center align-content-center w-full mb-5"
            v-if="!isLoadingTransactionHistoryBetnUsers">
            <div>
                <div class="flex flex-column justify-content-end align-content-center w-full">
                    <account-infos @borrowerClicked="handleBorrowerClicked" />
                </div>
            </div>
        </div>
        <div v-else>
            <ProgressSpinner />
        </div>
        <Button class="mr-2" @click="showDialog = true" severity="primary" label="Add a new Transaction" />
        <Button class="mt-3" @click="handleShowExpenseHistoryDialog" severity="warning"
            label="Show Expense Log for this month" />
    </div>
    <AddExpenseDialog :isTransactionSaveInProgress="isTransactionSaveInProgress" :visible="showDialog"
        @hideDialog="showDialog = false" @saveTransaction="handleTransactionSave" />
    <expense-history-dialog :visible="showExpenseHistoryDialog" @hideDialog="showExpenseHistoryDialog = false" />
    <user-expense-dialog @remindAboutIncorrectTransaction="reportIncorrectTransaction"
        @customUserTransactionDeleted="handleCustomTransactionDelete"
        :expenseHistoryBetweenTwoUsers="expenseHistoryBetweenTwoUsers" :selectedUserEmail="currentSelectedUserEmail"
        :selectedUserUsername="currentSelectedUserUsername" :visible="showUserExpenseDialog"
        @hideDialog="showUserExpenseDialog = false" />

</template>


<script setup>
import AccountInfos from './AmountInfos.vue'
import AddExpenseDialog from '../Dialog/AddExpenseDialog.vue'
import ExpenseHistoryDialog from '../Dialog/ExpenseHistoryDialog.vue'
import UserExpenseDialog from '../Dialog/UserExpenseDialog.vue'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

import ProgressSpinner from 'primevue/progressspinner';


const store = useStore();
const route = useRoute();
const router = useRouter();

let groupId = route.query.groupId;
store.dispatch('Group/getGroupInfo', groupId)

let isTransactionSaveInProgress = ref(false);

let email = ref('');
let showInviteDialog = ref(false);

let currentSelectedUserEmail = ref('');
let currentSelectedUserUsername = ref('');

let showUserExpenseDialog = ref(false);

let isLoadingTransactionHistoryBetnUsers = ref(true);

let currentLoggedInUser = computed(() => {
    return store.getters['User/username']
});

let expenseHistoryBetweenTwoUsers = computed(() => {
    return store.getters['Transaction/getCurrentTransactionBetweenSelectedUsers']
});

let groups = computed(() => {
    return store.getters['Group/getGroups']
});

let usersInGroup = computed(() => {
    return store.getters['Group/getAllUsers']
});

let totalExpense = computed(() => {
    return store.getters['Transaction/getTotalExpense']
});

let shouldShowInvitePeersButton = computed(async () => {
    let x = await store.getters['Group/getCurrentGroupInfo']
    return x.ownerEmail === localStorage.email;
});

let handleCustomTransactionDelete = ({ id, borrowerEmail }) => {
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
    store.dispatch('Transaction/getTransactionsBetweenTwoUsers', { borrowerEmail: email }).then((res) => {
        showUserExpenseDialog.value = true;
        expenseHistoryBetweenTwoUsers.value = res.data;
    });
}

let reportIncorrectTransaction = (id, targetEmail, reporter) => {
    store.dispatch('Transaction/reportIncorrectTransaction', { id, targetEmail, reporter }).then((res) => {
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

let handleTransactionSave = ({ selectedUserEmails, amt, desc, groupId }) => {
    isTransactionSaveInProgress.value = true;
    store.dispatch('Transaction/addCustomTransaction', { emails: selectedUserEmails, ownerEmail: localStorage.email, ownerUsername: localStorage.username, amount: amt, description: desc, groupId }).then((res) => {
        isTransactionSaveInProgress.value = false;
        showDialog.value = false;
        router.go(0);
    }).catch(() => {
        alert('Failed to save transaction');
        isTransactionSaveInProgress.value = false;
    });
}

let handleInvite = () => {
    store.dispatch('Group/addUserToGroup', { email: email.value, groupId: groupId }).then(() => {
        showInviteDialog.value = false;
    });
}

onMounted(() => {
    isLoadingTransactionHistoryBetnUsers.value = true;
    // store.dispatch('Transaction/getAmountsOwedToCurrentUser').then(res => {
    //     isLoadingTransactionHistoryBetnUsers.value = false;
    // });
    // store.dispatch('Transaction/getTotalExpense');

    console.log(route.query);
    let groupId = route.query.groupId;

    store.dispatch('Transaction/getAmountsOwedToCurrentUserInGroup', groupId).then(() => {
        isLoadingTransactionHistoryBetnUsers.value = false;
    });
})

</script>
