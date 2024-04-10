<template>
    <Card class="w-full h-1">
        <template #content>
            <div class="flex w-full align-items-center" style="height: 40px;">
                <p @click="$emit('borrowerClicked', email)" class="text-sm flex flex-1">{{ name }}</p>
                <p :class="amountClass" class="flex mr-4">${{ formattedAmount }}</p>
                <Button :loading="props.isBeingSettled" :disabled="props.amount<=0" @click="$emit('settleUp', email)" icon="pi pi-check" title="Settle" severity="contrast" text rounded aria-label="Settle" />
                <Button :loading="props.isBeingNotified" icon="pi pi-bell" @click="$emit('remindToSettle', email)" title="Notify" severity="secondary" text rounded aria-label="Notification" />
            </div>
        </template>
    </Card>
</template>

<script setup>
import { defineProps, computed, defineEmits } from 'vue';

const props = defineProps({
    email: String,
    name: String,
    amount: Number,
    isBeingSettled: Boolean,
    isBeingNotified: Boolean
})
const formattedAmount = computed(() => props.amount.toFixed(2));

const emit = defineEmits(['settleUp', 'borrowerClicked']);

const amountClass = computed(() => ({
    'text-sm': true,
    'flex': true,
    'text-red-500': props.amount < 0,
    'text-green-500': props.amount > 0
}));
</script>

<style scoped>
.text-red-500 {
    color: red;
}
.settleBtn{
    height: 10px;
    width: 20px;
}
</style>