<template>
    <Card class="w-4 h-2">
        <template #content>
            <div class="flex w-full align-items-center" style="height: 40px;">
                <p class="text-md flex flex-1">{{ name }}</p>
                <p :class="amountClass" class="flex mr-4">${{ amount }}</p>
                <Button :loading="props.isBeingSettled" v-if="props.amount>0" @click="$emit('settleUp', name)" icon="pi pi-check" title="Approve" severity="danger" text rounded aria-label="Settle" />
                <Button :loading="props.isBeingNotified" icon="pi pi-bell" @click="$emit('remindToSettle', name)" title="Notify" severity="secondary" text rounded aria-label="Notification" />
            </div>
        </template>
    </Card>
</template>

<script setup>
import { defineProps, computed, defineEmits } from 'vue';

const props = defineProps({
    name: String,
    amount: Number,
    isBeingSettled: Boolean,
    isBeingNotified: Boolean
})

const emit = defineEmits(['settleUp']);

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