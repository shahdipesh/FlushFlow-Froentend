<template>
    <div class="grid">
        <div class="col col-12">
            <h3 class="flex p-3 justify-content-end"> Welcome {{ currentUser.username }}</h3>
        </div>
        <div class="col-12">
            <div v-if="isWorkingThisWeek" class="text-center p-3 border-round-sm bg-primary font-bold ">
                You Are Scheduled To Work This Week :)
            </div>
            <div v-else class="text-center p-3 border-round-sm bg-secondary font-bold ">
                Hey! You are NOT SCHEDULED To Work This Week :)
            </div>
        </div>
        <div class="col-12">
            <div v-if="isWorkingThisWeek" class="text-center p-3 border-round-sm bg-primary font-bold ">
                <Button severity="secondary" @click="requestChoreApproval" label="Request Approval" />
            </div>
            <div v-else class="text-center p-3">
                <div v-if="!shouldDisableApproveBtn">
                    <div class="col-12">
                        <b>{{ store.getters['Schedule/getCurrentScheduledUserEmail'] }}</b> has requested approval on
                        their Chore.
                    </div>
                    <Button severity="danger" @click="handleChoreApproval" :label="getLabel" />

                </div>
                <div v-else-if="allChoresCompleted">All Flushed and Cleared for the week!!</div>

                <div v-else>
                    <div class="col-12">
                        <b>{{ store.getters['Schedule/getCurrentScheduledUserEmail'] }}</b> has not completed their
                        Chore Yet
                    </div>
                    <Button disabled severity="danger" @click="handleChoreApproval" label="Approve Chore" />
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
let currentUser = computed(() => store.getters['User/user']);
let scheduleForCurrentWeek = ref('');

let allChoresCompleted = ref(false);

let shouldDisableApproveBtn = computed(() => {
    let user = store.getters['Schedule/getScheduledUser'];
    return user.status != 'PA';
});

let scheduledUser = computed(() => {
    let user = store.getters['Schedule/getScheduledUser'];
    let email = user.email;
    return email;
});

const requestChoreApproval = async () => {
    let scheduleId = store.getters['Schedule/getCurrentScheduleId'];
    store.dispatch('Schedule/requestApproval', scheduleId);
}

const handleChoreApproval = async () => {
    let currentUser = store.getters['User/user'];
    let scheduleId = store.getters['Schedule/getCurrentScheduleId'];
    let res = store.dispatch('Schedule/approveChore', {email: currentUser.email, scheduleId: scheduleId});
    if (res) {
        shouldDisableApproveBtn.value = true;
    }
}

const didUserApproveTask = computed(() => {
    return store.getters['Schedule/getDidUserApproveTask'];
});

onMounted(async () => {
    await store.dispatch('Schedule/findScheduledUser');
});

let isWorkingThisWeek =computed(() => {
    let scheduledUser = store.getters['Schedule/getScheduledUser'];
    return scheduledUser.email === currentUser.value.email;
})

let getLabel = computed(() => {
    return didUserApproveTask.value ? 'Approved' : 'Approve Chore';
})

store.dispatch('Schedule/findScheduledUser');
</script>