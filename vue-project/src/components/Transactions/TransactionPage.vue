<template>
    <div class="flex flex-column justify-content-center align-items-center w-full mt-4">
        <div class="flex text-2xl w-full">
            <div class="flex justify-content-center align-items-center w-full">
                Account Summary
            </div>
        </div>
        <div class="flex flex-column justify-content-center align-content-center w-full mb-5">
            <div class="flex flex-column justify-content-end align-content-center w-full">
                <account-infos />
            </div>
        </div>
        <Button class="mr-2" @click="showDialog = true" severity="primary" label="Add a new Transaction" />
    </div>
    <Dialog :visible="showDialog" @hideDialog="showDialog = false" @saveTransaction="handleTransactionSave" />

</template>


<script setup>
import AccountInfos from './AmountInfos.vue'
import Dialog from '../Dialog/Dialog.vue'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore();

let totalExpense = computed(() => {
  return store.getters['Transaction/getTotalExpense']
});

let showDialog = ref(false);

let handleTransactionSave = ({amount,reason}) => {
    store.dispatch('Transaction/addTransaction', { email:localStorage.email, amount, reason });
    showDialog.value = false;
}

onMounted(() => {
    store.dispatch('Transaction/getAmountsOwedToCurrentUser');
    store.dispatch('Transaction/getTotalExpense');

})

</script>
