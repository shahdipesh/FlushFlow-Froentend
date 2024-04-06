import { createStore } from 'vuex';
import UserModule from './modules/User';
import ScheduleModule from './modules/Schedule'
import TransactionModule from './modules/Transaction'

const store = createStore({
    modules: {
        User: UserModule,
        Schedule: ScheduleModule,
        Transaction: TransactionModule
    }
});

export default store;