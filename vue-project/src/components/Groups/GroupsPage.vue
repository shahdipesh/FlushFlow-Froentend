<template>
    <div>
        <h1>Please select a Group</h1>
        <div v-for="group in groups"  class="flex align-items-center justify-content-center w-14rem h-4rem" :key="group.id">
            <Button @click="handleGroupSelection(group.id)">{{group.name}}</Button>
        </div>
    </div>
    <div>
        <Button type="button" @click="showCreateGroupDialog = true" label="Create a new Group" severity="warning"></Button>
    </div>
    <!-- <div class="overlay" v-if="showInviteDialog" @click="showInviteDialog = false">
        <Dialog class="dialog" :closable="false" v-model:visible="showInviteDialog" header="Invite peers to group">
            <div class="flex align-items-center gap-3 mb-5">
                <label for="Email" class="flex flex-1 font-semibold">Email</label>
                <InputText class="flex" v-model="email" id="Email" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="showInviteDialog = false"></Button>
                <Button :disabled="shouldDisableSave" :loading="isTransactionSaveInProgress" type="button" label="Invite"
                    @click="handleInvite"></Button>
            </div>
        </Dialog>
    </div> -->

    <div class="overlay" v-if="showCreateGroupDialog" @click="showCreateGroupDialog = false">
        <Dialog class="dialog" :closable="false" v-model:visible="showCreateGroupDialog" header="Create a group">
            <div class="flex align-items-center gap-3 mb-5">
                <label for="Name" class="flex flex-1 font-semibold">Group name</label>
                <InputText class="flex" v-model="name" id="Name" />
            </div>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="showCreateGroupDialog = false"></Button>
                <Button :disabled="shouldDisableSave" :loading="isTransactionSaveInProgress" type="button" label="Create Group"
                    @click="handleGroupCreation"></Button>
            </div>
        </Dialog>
    </div>
</template>


<script setup>

import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();

const showCreateGroupDialog = ref(false);

let name = ref('');

store.dispatch('Group/getGroupsForCurrentUser');

const groups = computed(()=>{
    return store.getters['Group/getGroups']
})

const handleGroupSelection = (id) =>{
    router.push(`transaction?groupId=${id}`)
}

const handleGroupCreation = () =>{
    store.dispatch('Group/createGroup', {name: name.value, owner: localStorage.email});
    showCreateGroupDialog.value = false;
}

</script>