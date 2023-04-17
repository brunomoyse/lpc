import { useUserStore } from '@/stores/userStore';

export default defineNuxtRouteMiddleware(async (to, from) => {
    // @ts-ignore
    const token = localStorage.getItem('access-token');
    if (to.name === 'login' && token) {
        return navigateTo('/');
    } else if (to.name !== 'login' && !token) {
        return navigateTo('/login');
    }
})
