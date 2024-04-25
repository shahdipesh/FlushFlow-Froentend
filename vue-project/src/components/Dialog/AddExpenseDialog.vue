<template>
    <div class="overlay" v-if="props.visible" @click="$emit('hideDialog')">
        <Dialog class="dialog" :closable="false" v-model:visible="props.visible" header="Add a new Expense">
            <div class="flex align-items-center gap-3 mb-2">
                <label for="amount" class="felx flex-1 font-semibold w-6rem">Amount</label>
                <InputNumber v-model="amount" inputId="currency-us" mode="currency" currency="USD" locale="en-US" />
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <label for="Expense Description" class="flex flex-1 font-semibold">Description</label>
                <InputText class="flex" v-model="description" id="Expense Description" />
            </div>
            <div class="flex align-items-center gap-3 mb-5 text-md font-bold">
                Paid By you and split between:
            </div>
            <div class="flex text-xs align-items-center mb-4 gap-2">
                <template v-for="user in usersInGroup">
                    <div class="flex gap-2" v-if="currentUserEmail != user.email">
                        <Checkbox v-model="selectedUserEmails" :value="user.email" class="flex flex-1" />
                        {{ user.email }}
                    </div>
                </template>
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="$emit('hideDialog')"></Button>
                <Button :disabled="shouldDisableSave" :loading="isTransactionSaveInProgress" type="button" label="Save"
                    @click="handleSave(selectedUserEmails, amount, description)"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();

const props = defineProps({
    visible: Boolean,
    isTransactionSaveInProgress: Boolean
})

let description = ref('');
let amount = ref(0);

let selectedUserEmails = ref([]);

let shouldDisableSave = computed(()=>{
    return description.value==='' || amount.value=='' || amount.value<=0;
});

let usersInGroup = computed(() => {
    return store.getters['Group/getAllUsers']
});

let currentUserEmail = computed(() => {
    return store.getters['User/email']
});

let handleAmtChange=(e) =>{
    console.log(e)
}

const  emit  = defineEmits(['hideDialog']);

let handleSave = (selectedUserEmails, amt, desc) => {
    let groupId = route.query.groupId;
    description.value='';
    amount.value=0;
    emit('saveTransaction', { selectedUserEmails, amt, desc, groupId });
}

onMounted(() => {
    let groupId = route.query.groupId;
    store.dispatch('Group/getAllUsers', groupId);
});

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