<template>
    <div class="overlay" v-if="props.visible" @click="$emit('hideDialog')">
        <Dialog class="dialog" :closable="false" v-model:visible="props.visible" header="Expense History">
                <template v-for="transaction in transactionHistory">
                    <card>
                        <template #content>
                            <div class="text-xs">
                               {{ transaction.username }} spent {{ transaction.amount }} for {{ transaction.reason }} on {{ formatDate(transaction.date) }}
                            </div>
                        </template>
                    </card>
                </template>
            <div class="flex justify-content-end gap-2 mt-3">
                <Button type="button" label="Cancel" severity="secondary" @click="$emit('hideDialog')"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore();

const props = defineProps({
    visible: Boolean
})

let transactionHistory = computed(() => {
    return store.getters['Transaction/getAllTransactionsForThisMonth']
});

const { emit } = defineEmits(['hideDialog']);

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthName = date.toLocaleString('default', { month: 'long' });
    return `${monthName} ${date.getDate()}`;
};

onMounted(() => {
    store.dispatch('Transaction/getAllTransactionsForThisMonth');
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
    width: 100%;
    max-width: 27rem;
}
</style>