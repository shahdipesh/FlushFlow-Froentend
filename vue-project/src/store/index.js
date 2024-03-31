import { createStore } from 'vuex';
import UserModule from './modules/User';
import ScheduleModule from './modules/Schedule'

const store = createStore({
    modules: {
        User: UserModule,
        Schedule: ScheduleModule
    }
});

export default store;