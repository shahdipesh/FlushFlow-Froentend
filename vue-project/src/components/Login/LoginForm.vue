<template>
    <div class="flex flex-column gap-3 align-items-center">
        Login
        <div class="flex flex-column">
            <label for="username">Email</label>
            <InputText type="email" id="username" v-model="form.email" aria-describedby="username-help" />
            <small id="username-help">Enter your email.</small>
        </div>
        <div class="flex flex-column">
            <label for="password">Password</label>
            <InputText id="password" type="password" v-model="form.password" aria-describedby="password-help" />
            <small id="password-help">Enter your Password.</small>
        </div>
        <div class="col-12">
            <div class="flex align-items-center flex-column gap-2">
                <Button @click="handleLogin" label="Login" />
            </div>
        </div>
        <div class="col-12">
            <div class="flex align-items-center flex-column gap-2">
                <h4>Dont Have an Account? <router-link to="/register">Register</router-link></h4>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { required, email } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';


const store = useStore();

const router = useRouter();

const form = reactive({
  email: 'dipeshasd@gmail.com',
  password: 'asdasd'
});

const rules = reactive({
  email: { required, email },
  password: { required }
});

const v$ = useVuelidate(rules, form);

const handleLogin = () => {

    let res = store.dispatch('User/login', { email: form.email, password: form.password });

    if(res){
        router.replace('/index');
    }
    // v$.value.$touch();
    // if (!v$.value.$error) {
    //     try {
    //         store.dispatch('User/login', { email: email.value, password: password.value });
    //         alert("Logged In");
    //         // Consider redirecting the user after a successful login
    //     } catch (error) {
    //         alert("Login failed");
    //     }
    // } else {
    //     alert("Please correct the errors before submitting.");
    // }
}
</script>
