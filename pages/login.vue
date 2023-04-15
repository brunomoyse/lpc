<template>
    <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center">
            <div class="flex flex-col items-center justify-center">
                <div class="flex flex-col items-center justify-center">
                    <label for="email" class="text-xl font-bold">Email</label>
                    <input type="email" id="email" class="border-2 border-gray-300 p-2 rounded-lg" v-model="email" />
                </div>
                <div class="flex flex-col items-center justify-center">
                    <label for="password" class="text-xl font-bold">Password</label>
                    <input type="password" id="password" class="border-2 border-gray-300 p-2 rounded-lg" v-model="password" />
                </div>
                <div class="flex flex-col items-center justify-center">
                    <button class="bg-blue-500 text-white p-2 rounded-lg" @click="login">Login</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useUserStore } from "@/stores/userStore";
    import {useTournamentStore} from "~/stores/tournamentStore";

    const config = useRuntimeConfig();
    const router = useRouter();

    let email = 'moyse94@gmail.com';
    let password = 'admin';

    const userStore = useUserStore();
    const login = async () => {
        await userStore.loginUser({email, password});
        const loggedInUser = userStore.currentUser;
        if (loggedInUser) {
            router.push('/');
        } else {
            console.log('Login failed');
        }
    }



</script>
