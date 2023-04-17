import {defineStore} from "pinia";
import {useApiService} from "@/apiService";

export const useUserStore = defineStore({
    id: "userStore",
    state: () => ({
        currentUser: null as any//as User|null,
    }),
    actions: {
        async loginUser(args: any) {
            let res = await useApiService.loginUser(args);
            const user = res.value.user;
            const token = res.value.token;
            //@ts-ignore
            localStorage.setItem('access-token', token);
            if (user) this.currentUser = user;
        },
        async logoutUser() {
            await useFetch('/logout');
            this.currentUser = null;
            //@ts-ignore
            localStorage.removeItem('access-token');
        },
    },
    persist: {
        storage: persistedState.localStorage,
    },
})
