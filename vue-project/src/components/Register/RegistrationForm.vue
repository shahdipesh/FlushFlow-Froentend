<template>
    <div v-if="!tokenRequested" class="flex flex-column justify-content-center">
        <div>
            <p class="text-3xl text-center font-medium">Create an Account</p>
        </div>
        <div class="flex flex-column">
            <div class="flex justify-content-center mb-4">
                <FloatLabel>
                    <label for="username">Username</label>
                    <InputText id="username" v-model="username" aria-describedby="username-help" />
                </FloatLabel>
            </div>
            <div class="flex justify-content-center mb-4">
                <FloatLabel>
                    <label for="email">Email</label>
                    <InputText id="email" v-model="email" aria-describedby="email-help" />
                </FloatLabel>
            </div>
            <div class="flex justify-content-center mb-4">
                <FloatLabel>
                    <label for="password">Password</label>
                    <InputText :invalid="isInvalid" type="password" id="password" v-model="password"
                        aria-describedby="password-help" />
                </FloatLabel>
            </div>
            <div class="flex justify-content-center mb-4">
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
                <Button :loading="loading" @click="sendToken" label="Register" />
            </div>
        </div>
        <div class="col-12">
            <div class="flex align-items-center flex-column gap-2">
                <p class="text-sm text-center font-medium">Already Have an Account? <router-link
                        to="/login">Login</router-link></p>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="flex flex-column full-h align-items-center">
            <div>
                <p class="text-lg text-center font-medium">Please Enter the 4 digit code sent to your email</p>
            </div>
            <TokenComponent :verifyingToken="verifyingToken" @token-submitted="handleRegister"/>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

let username = ref('');
let email = ref('');
let password = ref('');
let password1 = ref('');

let verifyingToken = ref(false);

const loading = ref(false);

let isInvalid = ref(false);

let violatedRules = ref([]);

let tokenRequested = ref(false);

const sendToken = async () => {

    if (validatePwd(password1.value, password.value)) {
        loading.value = true;
        store.dispatch('User/sendToken', {email: email.value, password: password.value })
        .then((res) => {
            if (res) {
                tokenRequested.value = true;
            } else {
                alert('Failed to send token');
            }
        })
        .catch(() => {
            alert('An error occured. Please try again later');
        })
    }
}

const handleRegister = async (token) => {
     if (validatePwd(password1.value, password.value)) {
        verifyingToken.value = true;
        loading.value = true;
        store.dispatch('User/register', { username: username.value, email: email.value, password: password.value, token: token})
            .then(res => {
                debugger;
                if (res.status == 200) {
                    alert('Registered');
                    router.replace('/login');
                }
                else if (res.status == 401) {
                    alert('Invalid Token');
                }
                else {
                    alert('Failed to Register');
                }
                loading.value = false;
            })
            .catch(error => {
                console.error(error);
                loading.value = false;
            })
            .finally(() => {
                verifyingToken.value = false;
                loading.value = false;
            });
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
