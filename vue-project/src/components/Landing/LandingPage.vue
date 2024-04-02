<template>
    <div class="grid">
        <div class="col col-12">
            <h3 class="flex p-3 justify-content-end"> Welcome {{ currentUser.username }}</h3>
        </div>
        <div class="col-12">
            <div v-if="isWorkingThisWeek && isTaskCompleted"
                class="text-center p-3 border-round-sm bg-primary font-bold ">
                Your chore for this week has been completed and Approved.
            </div>
            <div v-else-if="isWorkingThisWeek" class="text-center p-3 border-round-sm bg-primary font-bold ">
                You Are Scheduled To Work This Week :)
            </div>
            <div v-else class="text-center p-3 border-round-sm bg-secondary font-bold ">
                Hey! You are NOT SCHEDULED To Work This Week :)
            </div>
        </div>
        <div class="col-12">
            <div v-if="isWorkingThisWeek" class="text-center p-3 border-round-sm bg-primary font-bold ">
                <div v-if="hasAskedForApproval && !isTaskCompleted">
                    {{ currentUser.username }} You Have Already Requested Approval. Good Job!
                </div>
                <div v-else-if="!isTaskCompleted">
                    <Button severity="secondary" @click="requestChoreApproval" label="Request Approval" />
                </div>
            </div>
            <div v-else class="text-center p-3">
                <div v-if="isTaskCompleted">
                  {{ scheduledUser.email }}  has completed their chore. All flushed up and clear!
                </div>
                <div v-else-if="hasAskedForApproval">
                    <div class="col-12">
                        {{ scheduledUser.email }} has requested approval on their Chore.
                    </div>
                    <div class="div" v-if="hasCurrentUserApprovedTask">
                        <Button severity="danger" disabled @click="handleChoreApproval" label="Approved" />
                    </div>
                    <div class="div" v-else>
                        <Button severity="danger" @click="handleChoreApproval" label="Approve" />
                    </div>
                </div>
                <div v-else-if="allChoresCompleted">All Flushed and Cleared for the week!!</div>

                <div v-else>
                    <div class="col-12">
                        {{ scheduledUser.email }} has not completed their Chore Yet
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
let scheduledUser = computed(() => store.getters['Schedule/getScheduledUser']);

let allChoresCompleted = ref(false);

let isTaskCompleted = computed(() => {
    return store.getters['Schedule/getIsCurrentTaskCompleted'];
});

let hasAskedForApproval = computed(() => {
    return store.getters['Schedule/getHasAlreadyRequestedApproval'];
});

const requestChoreApproval = async () => {
    let scheduleId = store.getters['Schedule/getCurrentScheduleId'];
    store.dispatch('Schedule/requestApproval', scheduleId);
}

const handleChoreApproval = async () => {
    let currentUser = store.getters['User/user'];
    let scheduleId = store.getters['Schedule/getCurrentScheduleId'];
    store.dispatch('Schedule/approveChore', { email: currentUser.email, scheduleId: scheduleId });
}

const didUserApproveTask = computed(() => {
    return store.getters['Schedule/getDidUserApproveTask'];
});

let hasCurrentUserApprovedTask = computed(() => {
    return store.getters['Schedule/getDidUserApproveTask'];
});

let isWorkingThisWeek = computed( () => {
    return store.getters['User/isWorkingThisWeek'];
})

store.dispatch('Schedule/findScheduledUser');

</script>