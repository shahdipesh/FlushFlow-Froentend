import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/Login/LoginPage.vue';
import RegistrationPage from '../components/Register/RegistrationPage.vue';
import LandingPage from '../components/Landing/LandingPage.vue';
import store from '../store/index';

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    beforeEnter: (to, from) => {
      if(localStorage.getItem('token')) {
        return { name: 'LandingPage' }
      }
  }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegistrationPage
  },
  {
    path: '/index',
    name: 'LandingPage',
    component: LandingPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LoginPage,
    beforeEnter: (to, from) => {
      store.dispatch('User/logout');
    }
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/index'
  }
];

const router = createRouter({
  history: createWebHistory(), // Or createWebHashHistory() if you prefer hash-based routing
  routes
});

//before each route if user is logged in

router.beforeEach((to, from) => {
  if (from.name!="Login" && to.meta.requiresAuth) {
    return store.dispatch('User/getCurrentLoggedInUser').then((res) => {
        if (!store.getters['User/isLoggedIn']) {
            return { name: 'loginForm' };
        }

        return true;
    });
}
});

export default router;