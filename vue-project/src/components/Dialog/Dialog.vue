<template>
    <div  class="overlay" v-if="props.visible" @click="$emit('hideDialog')">
        <Dialog :closable="false" v-model:visible="props.visible" header="Add a new Transaction"
            :style="{ width: '27rem' }">
            <div class="flex align-items-center gap-3 mb-3">
                <label for="Expense Description" class="flex flex-1 font-semibold w-6rem">Description</label>
                <InputText v-model="reason" id="Expense Description" class="flex flex-1" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-5">
                <label for="amount" class="felx flex-1 font-semibold w-6rem">Amount</label>
                <InputNumber v-model="amount" inputId="currency-us" mode="currency" currency="USD"
                    locale="en-US" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="$emit('hideDialog')"></Button>
                <Button type="button" label="Save" @click="$emit('saveTransaction', { amount, reason })"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
    visible: Boolean
})

let reason = ref('');
let amount = ref();

const { emit } = defineEmits(['hideDialog']);

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
</style>