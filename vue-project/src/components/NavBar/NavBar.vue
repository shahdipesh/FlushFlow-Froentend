
<template>
    <div class="card">
        <Menubar :model="items" />
    </div>
</template>

<script setup>
import { ref } from "vue";

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
</script>
