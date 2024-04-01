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

const handleLogin = async () => {

    let res = await store.dispatch('User/login', { email: form.email, password: form.password });
    if(res){
        router.replace('/index');
    }
    else{
        alert("Incorrect Password");
    }
}
</script>
