import {defineStore} from "pinia";
import {useApiService} from "@/apiService";
import {User} from "@prisma/client";

export const useUserStore = defineStore({
    id: "userStore",
    state: () => ({
        currentUser: null as User|null,
    }),
    actions: {
        async loginUser(args: any) {
            const currentUser = await useApiService.loginUser(args);
            if (currentUser) this.currentUser = currentUser.value;
        },
        async logoutUser() {
            await useFetch('/logout');
            this.currentUser = null;
        }
    }
    persist: {
        storage: persistedState.localStorage,
    },
})
