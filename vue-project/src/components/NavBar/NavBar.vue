
<template>
    <div class="card">
        <Menubar :model="items">
            <template #start>
                <p class="text-md text-center font-medium">FlushFlow | </p>
             </template>
        <template v-if="currentUser" #end>
           <Button icon="pi pi-sign-out" severity="secondary" @click="handleLogout" label="Logout" />
        </template>
        </Menubar>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();

let currentUser = computed(() => store.getters["User/user"]);

const baseItems = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => router.push('/')
    },
    {
        label:'Contact',
        icon: 'pi pi-envelope',
        command: () => window.open('https://portfolio-shahdipesh.vercel.app/#contact')
    }
]);

const items = computed(() => {
    if (currentUser.value) {
        return [
            ...baseItems.value,
            {
                label: 'Account Settings',
                icon: 'pi pi-cog',
                command: () => router.push('/account')
            },
            {
                label: 'Transactions',
                icon: 'pi pi-money-bill',
                command: () => router.push('/transaction')
            }
        ];
    }
    return baseItems.value;
});

const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    store.dispatch("User/logout");
    router.replace("/login");
};
</script>
