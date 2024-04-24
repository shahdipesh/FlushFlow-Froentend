<template>
    <div>
        <h1>Please select a Group</h1>
        <div class="flex align-items-center justify-content-center w-14rem h-4rem" v-for="group in groups" :key="group.id">
            <Button @click="handleGroupSelection(group.name)">{{group.name}}</Button>
        </div>
    </div>
</template>


<script setup>

import { useStore } from 'vuex';
import { computed } from 'vue';
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();

store.dispatch('Group/getGroupsForCurrentUser');

const groups = computed(()=>{
    return store.getters['Group/getGroups']
})

const handleGroupSelection = (name) =>{
    router.push(`/transactions/${name}`)
}
</script>