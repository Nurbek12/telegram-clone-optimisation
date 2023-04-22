import Vue from 'vue'
import VueRouter from 'vue-router'
import Telegram from '@/views/Telegram.vue'
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import store from '../store/store';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: Telegram,
        name: 'home',
        beforeEnter: (_, __, next) => {
            if(!store.getters.isLoggedIn) next('/login')
            else if(store.getters.user.registered === false) next('/register')
            else next()
        }
    },
    {
        path: '/login',
        component: Login,
        name: 'login',
    },
    {
        path: '/register',
        component: Register,
        name: 'regsiter',
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
  
  export default router