<template>
    <Card class="w-full h-1">
        <template #content>
            <div class="flex w-full align-items-center" style="height: 40px;">
                <p @click="$emit('borrowerClicked', email)" class="text-sm flex flex-1">
                    {{ name }}
                    <i v-if="props?.amount > 0" class="text-xs ml-3" style="color:green">owes</i>
                    <i v-else-if="props?.amount < 0" class="text-xs ml-3" style="color:red">you own then</i>
                </p>
                <p :class="amountClass" class="flex mr-4">${{ formattedAmount }}</p>
                <Button :loading="isBeingSettled" :disabled="props.amount<=0" @click="settleBalance(props.email)" icon="pi pi-check" title="Settle" severity="contrast" text rounded aria-label="Settle" />
                <Button :loading="isBeingNotified" icon="pi pi-bell" :disabled="props.amount==0" @click="remindToSettle(email)" title="Notify" severity="secondary" text rounded aria-label="Notification" />
            </div>
        </template>
    </Card>
</template>

<script setup>
import { defineProps,ref,  computed, defineEmits } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
    email: String,
    name: String,
    amount: Number,
    isBeingSettled: Boolean,
    isBeingNotified: Boolean
})
const formattedAmount = computed(() => props.amount.toFixed(2));

const emit = defineEmits(['settleUp', 'borrowerClicked']);

const isBeingSettled = ref(false);

const isBeingNotified = ref(false);

const amountClass = computed(() => ({
    'text-sm': true,
    'flex': true,
    'text-red-500': props.amount < 0,
    'text-green-500': props.amount > 0
}));

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

<style scoped>
.text-red-500 {
    color: red;
}
.settleBtn{
    height: 10px;
    width: 20px;
}
.p-card{
    margin-bottom: 5px;
    border: 1.5px solid #ad94ec;
}
</style>