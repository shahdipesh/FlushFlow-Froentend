<template>
    <div class="flex flex-column justify-content-center">
        <div>
            <p class="text-3xl text-center font-medium">Create an Account</p>
        </div>
        <div class="flex flex-column justify-content-evenly">
            <div class="flex justify-content-center m-2">
                <FloatLabel>
                    <label for="username">Username</label>
                    <InputText id="username" v-model="username" aria-describedby="username-help" />
                </FloatLabel>
            </div>
            <div class="flex justify-content-center m-2">
                <FloatLabel>
                    <label for="email">Email</label>
                    <InputText id="email" v-model="email" aria-describedby="email-help" />
                </FloatLabel>
            </div>
            <div class="flex justify-content-center m-2">
                <FloatLabel>
                    <label for="password">Password</label>
                    <InputText :invalid="isInvalid" type="password" id="password" v-model="password"
                        aria-describedby="password-help" />
                </FloatLabel>
            </div>
            <div class="flex justify-content-center m-2">
                <FloatLabel>
                    <label for="repeatPassword">Repeat Password</label>
                    <InputText :invalid="isInvalid" type="password" id="repeatPassword" v-model="password1"
                        aria-describedby="password-repeat-help" />
                </FloatLabel>
            </div>
        </div>
        <ul v-if="isInvalid">
            <li v-for="(error) in violatedRules" style="color:red">{{ error }}</li>
        </ul>
        <div class="col-12">
            <div class="flex align-items-center flex-column gap-2">
                <Button :loading="loading" @click="handleRegister" label="Register" />
            </div>
        </div>
        <div class="col-12">
            <div class="flex align-items-center flex-column gap-2">
                <p class="text-sm text-center font-medium">Already Have an Account? <router-link to="/login">Login</router-link></p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

let username = ref('');
let email = ref('');
let password = ref('');
let password1 = ref('');

const loading = ref(false);

let isInvalid = ref(false);

let violatedRules = ref([]);

const handleRegister = async () => {
    if (validatePwd(password1.value, password.value)) {
        loading.value = true;
        let res = await store.dispatch('User/register', { username: username.value, email: email.value, password: password.value });
        if (res) {
            alert('Registered');
        } else {
            alert('Failed to Register');
        }
        loading.value = false;
    }
}

const validatePwd = (p1, p2) => {
    if (p1.length < 5 || p2.length < 5) {
        isInvalid.value = true;
        violatedRules.value.push(`Passwords need to be atleast 5 digits`);
        return false;
    }

    if (checkPwdSame(p1, p2)) {
        violatedRules.value = [];
        isInvalid = false;
        return true;
    }
    return false;
}

const checkPwdSame = (p1, p2) => {
    if (p1 != p2) {
        isInvalid.value = true;
        violatedRules.value.push(`Passwords don't match`);
        return false;
    }
    return true;
}
</script>
