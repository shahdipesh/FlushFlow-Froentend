
<template>
    <div class="card">
        <Menubar :model="items">
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

const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home'
    },
    {
        label: 'Account Settings',
        icon: 'pi pi-star'
    },
    {
        label: 'Contact',
        icon: 'pi pi-envelope'
    }
]);

const handleLogout = () => {
    store.dispatch("User/logout");
    router.replace("/login");
};
</script>
