import { useUserStore } from '@/stores/userStore';
export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = await useUserStore();
    const currentUser = await userStore.currentUser;
    let isLoggedIn = !!currentUser;
    if (to.name === 'login' && isLoggedIn) {
        return navigateTo('/');
    }
    if (to.name !== 'login' && !isLoggedIn) {
        return navigateTo('/login');
    }
})
