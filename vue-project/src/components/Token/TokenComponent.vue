
<template>
    <div class="flex flex-column justify-content-evenly h-10rem">
        <div class="flex justify-content-center">
            <InputOtp v-model="token" />
        </div>
        <div class="flex justify-content-center">
            <Button :loading="verifyingToken" @click="handleTokenSubmission" label="Verify" />
        </div>
    </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue';

const token = ref('');
let verifyingToken = ref(false);

const emit = defineEmits('token-submitted');

const props = defineProps({
    verifyingToken: Boolean
});

const handleTokenSubmission = () => {
    emit('token-submitted', token.value);
};

watch(() => props.verifyingToken, (value) => {
    verifyingToken.value = value;
});

</script>
