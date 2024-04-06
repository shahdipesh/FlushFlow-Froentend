<template>
    <div class="justify-content-center align-content-center w-full">
        <div class="flex flex-column mt-8 h-full justify-content-start align-items-center">
            <div class="text-2xl mb-2">Balance</div>
            <div class="flex flex-column w-full align-items-center">
            <template v-for="amount in AmountInfos">
                   <account-info :is-being-notified="isBeingNotified" :is-being-settled="isBeingSettled" @settle-up="settleBalance" @remindToSettle="remindToSettle" :amount="amount.amount" :name="amount.email"/>
            </template>
            </div>
        </div>
    </div>

</template>


<script setup>
import AccountInfo from './AmountInfo.vue'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore();

let isBeingSettled = ref(false);
let isBeingNotified = ref(false);

let AmountInfos = computed(() => {
  return store.getters['Transaction/getAmountOwedByAll']
});

let settleBalance = (email) => {
    isBeingSettled.value = true;
    store.dispatch('Transaction/settleUp', {borrowerEmail: email}).then(() => {
        isBeingSettled.value = false;
    }).catch(() => {
        isBeingSettled.value = false;
    });
}

let remindToSettle = (email) => {
    isBeingNotified.value = true;
    store.dispatch('Transaction/sendReminder', {borrowerEmail: email}).then(() => {
        isBeingNotified.value = false;
    }).catch(() => {
        isBeingNotified.value = false;
    });
}

</script>
