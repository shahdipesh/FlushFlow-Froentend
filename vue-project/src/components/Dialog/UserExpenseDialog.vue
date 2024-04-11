<template>
    <div class="overlay" v-if="props.visible" @click="$emit('hideDialog')">
        <ProgressSpinner v-if="isDeleteTransactionInProgress"/>
        <Dialog v-else class="dialog" :closable="false" v-model:visible="props.visible" header="Expense between you and ">
            <template #header>
                Expense between You and {{ selectedUserUsername }}
                </template>
            <template v-for="transaction in props.expenseHistoryBetweenTwoUsers">
                <card>
                    <template #content>
                        <div class="flex">
                        <div class="text-xs" v-if="transaction.owns!=currentUserEmail">
                            {{ transaction.owns }} paid ${{ transaction.amount }} for {{ transaction.reason }} on {{ formatDate(transaction.date) }}
                        </div>
                        <div class="text-xs" v-else>
                            You paid ${{ transaction.amount }} for {{ transaction.reason }} on {{ formatDate(transaction.date) }}
                        </div>
                        <div  class="flex ml-2 w-3 h-1rem" v-if="transaction.owns===currentUserEmail">
                            <Button @loading="isDeleteTransactionInProgress" type="button" severity="danger" label="Settle" @click="deleteTransaction(transaction.id)">Delete</Button>
                        </div>
                        <div v-else class="flex justify-content-center ml-2 w-3 h-1rem">
                            <Button :loading="props.isBeingNotified" icon="pi pi-bell" @click="$emit('remindAboutIncorrectTransaction', transaction.id, selectedUserEmail, currentUserEmail)"title="Notify" severity="secondary" text rounded aria-label="Notification" />
                        </div>
                    </div>
                    </template>
                </card>
            </template>
            <Button class="mt-3" style="float:right" type="button" label="Cancel" severity="secondary" @click="$emit('hideDialog')"></Button>
        </Dialog>
    </div>
</template>

<script setup>
import { defineProps, watch, defineEmits, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import ProgressSpinner from 'primevue/progressspinner';


const store = useStore();

const props = defineProps({
    visible: Boolean,
    selectedUserEmail: String,
    selectedUserUsername: String,
    expenseHistoryBetweenTwoUsers: Array
})

let currentUserEmail = computed(() => {
    return store.getters['User/email']
});

let description = ref('');
let amount = ref();

let selectedUserEmails = ref([]);

let isDeleteTransactionInProgress = ref(false);

let users = computed(() => {
    return store.getters['Transaction/getAllUsers']
});


let formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthName = date.toLocaleString('default', { month: 'long' });
    return `${monthName} ${date.getDate()}`;
};

const deleteTransaction = (id) => {
    isDeleteTransactionInProgress.value = true;
    store.dispatch('Transaction/deleteTransactionCustom',{id,borrowerEmail: props.selectedUserEmail}).then((res) => {
        store.dispatch('Transaction/getTransactionsBetweenTwoUsers', {borrowerEmail:props.selectedUserEmail}).then((res) => {
            props.expenseHistoryBetweenTwoUsers = res.data;
            isDeleteTransactionInProgress.value = false;
        }).catch((err) => {
            isDeleteTransactionInProgress.value = false;
        });
        // emit('customUserTransactionDeleted', {id, borrowerEmail: props.selectedUserEmail});
        isDeleteTransactionInProgress.value = false;
    });
};

const { emit } = defineEmits(['hideDialog']);

onMounted(() => {
    store.dispatch('Transaction/getAllUsers');
})

</script>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.dialog {
    width: 80%;
    max-width: 27rem;
}

</style>