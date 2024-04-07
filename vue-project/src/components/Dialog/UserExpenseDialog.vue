<template>
    <div class="overlay" v-if="props.visible" @click="$emit('hideDialog')">
        <Dialog class="dialog" :closable="false" v-model:visible="props.visible" header="Expense between you and ">
            <template #header>
                Expense between You and {{ selectedUserEmail }}
                </template>
            <template v-for="transaction in props.expenseHistoryBetweenTwoUsers">
                <card>
                    <template #content>
                        <div class="text-xs">
                            {{ transaction.owns }} spent ${{ transaction.amount }} for {{ transaction.reason }} on {{ formatDate(transaction.date) }}
                        </div>
                    </template>
                </card>
            </template>
            <Button class="mt-3" style="float:right" type="button" label="Cancel" severity="secondary" @click="$emit('hideDialog')"></Button>
        </Dialog>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore();

const props = defineProps({
    visible: Boolean,
    selectedUserEmail: String,
    expenseHistoryBetweenTwoUsers: Array
})

let description = ref('');
let amount = ref();

let selectedUserEmails = ref([]);

let users = computed(() => {
    return store.getters['Transaction/getAllUsers']
});

let currentUserEmail = computed(() => {
    return store.getters['User/email']
});


let formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthName = date.toLocaleString('default', { month: 'long' });
    return `${monthName} ${date.getDate()}`;
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