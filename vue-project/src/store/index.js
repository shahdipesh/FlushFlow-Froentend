import { createStore } from 'vuex';
import UserModule from './modules/User';
import ScheduleModule from './modules/Schedule'
import TransactionModule from './modules/Transaction'
import GroupModule from './modules/Group'

const store = createStore({
    modules: {
        User: UserModule,
        Schedule: ScheduleModule,
        Transaction: TransactionModule,
        Group: GroupModule
    }
});

export default store;