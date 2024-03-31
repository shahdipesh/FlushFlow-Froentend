<template>
    <div class="grid">
        <div class="col-5 col-offset-3">
            <div class="col-12 col-offset-4">
                <h2>Register</h2>
            </div>
            <div class="col-12">
                <div class="flex flex-column gap-2">
                    <label for="username">Username</label>
                    <InputText type="email" id="username" v-model="username" aria-describedby="username-help" />
                    <small id="username-help">Enter your preferred Username.</small>
                </div>
            </div>
            <div class="col-12">
                <div class="flex flex-column gap-2">
                    <label for="email">Email</label>
                    <InputText id="email" v-model="email" aria-describedby="email-help" />
                    <small id="email-help">Enter your email.</small>
                </div>
            </div>
            <div class="col-12">
                <div class="flex flex-column gap-2">
                    <label for="password">Password</label>
                    <InputText :invalid="isInvalid" type="password" id="password" v-model="password"
                        aria-describedby="password-help" />
                    <small id="password-help">Enter your Password.</small>
                </div>
            </div>
            <div class="col-12">
                <div class="flex flex-column gap-2">
                    <label for="password">Repeat Password</label>
                    <InputText :invalid="isInvalid" type="password" id="password" v-model="password1"
                        aria-describedby="password-help" />
                    <small id="password-help">Reenter your Password.</small>
                </div>
            </div>
            <ul v-if="isInvalid">
                <li v-for="(error) in violatedRules" style="color:red">{{ error }}</li>
            </ul>
            <div class="col-12">
                <div class="flex align-items-center flex-column gap-2">
                    <Button @click="handleRegister" label="Register" />
                </div>
            </div>
            <div class="col-12">
                <div class="flex align-items-center flex-column gap-2">
                    <h4>Already Have an Account? <router-link to="/login">Login</router-link></h4>
                </div>
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

let isInvalid = ref(false);

let violatedRules = ref([]);

const handleRegister = () => {
    if(validatePwd(password1.value, password.value)){
        let res = store.dispatch('User/register', {username:username.value, email:email.value, password:password.value});
        if(res){
            alert('Registered');
        }
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
        isInvalid=false;
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
