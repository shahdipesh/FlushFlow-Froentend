<template>
    <div class="flex flex-column gap-3 align-items-center">
        <p class="text-4xl text-center font-medium">Welcome</p>
        <div class="flex flex-column">
            <FloatLabel>
                <label for="username">Email</label>
                <InputText size="medium" type="email" id="username" v-model="form.email" aria-describedby="username-help" />
            </FloatLabel>
        </div>
        <div class="flex flex-column" style="margin-top: 15px;">
            <FloatLabel>
                <label for="password">Password</label>
                <InputText size="medium" id="password" type="password" v-model="form.password" aria-describedby="password-help" />
            </FloatLabel>
        </div>
        <div class="col-12">
            <div class="flex align-items-center flex-column gap-2">
                <Button :loading="loading" @click="handleLogin" label="Login" />
            </div>
        </div>
        <div class="col-12">
            <div class="flex align-items-center flex-column gap-2">
                <p class="text-sm text-center font-medium">Dont Have an Account? <router-link to="/register">Register</router-link></p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';
import { required, email } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';


const store = useStore();

const router = useRouter();

const form = reactive({
    email: '',
    password: ''
});

const loading = ref(false);

const rules = reactive({
    email: { required, email },
    password: { required }
});

const v$ = useVuelidate(rules, form);

const handleLogin = async () => {
    loading.value = true;
    let res = await store.dispatch('User/login', { email: form.email, password: form.password });
    if (res) {
        router.replace('/index');
    }
    else {
        alert("Incorrect Password");
    }
    loading.value = false;
}
</script>
