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
                    <button class="bg-blue-500 text-white p-2 rounded-lg" @click="loginUser">Login</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import {Ref} from "vue";
    import {User} from "~/composables/types";
    const config = useRuntimeConfig();
    const router = useRouter();

    let email = 'moyse94@gmail.com';
    let password = 'admin';
    const loginUser = async () => {
        const {data, pending, refresh, error} = await useFetch(config.public.apiBase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `mutation LoginUser(
            $email: String!
            $password: String!
        ) {
            loginUser (
                email: $email
                password: $password
            ){
                id
                lastName
                firstName
            }
        }`,
                variables: {
                    email: email,
                    password: password
                }
            }),
            transform: (res: any) => res.data.loginUser,
        });

        if (error?.value) console.error(error.value);
        if (data) {
            //data as Ref<User>
            await router.push('/');
        }
        else throw createError({statusCode: 500, message: 'La connection a échoué'});
    }
</script>
