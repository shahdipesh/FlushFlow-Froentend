import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/Login/LoginPage.vue';
import RegistrationPage from '../components/Register/RegistrationPage.vue';
import LandingPage from '../components/Landing/LandingPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegistrationPage
  },
  {
    path: '/index',
    name: 'LandingPage',
    component: LandingPage
  }
];

const router = createRouter({
  history: createWebHistory(), // Or createWebHashHistory() if you prefer hash-based routing
  routes
});

export default router;