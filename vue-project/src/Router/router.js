import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/Login/LoginForm.vue';
import RegistrationForm from '../components/Register/RegistrationForm.vue';
import LandingPage from '../components/Landing/LandingPage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/register',
    name: 'Register',
    component: RegistrationForm
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