<template>
    <div>
        <div class="text-teal-500">
            <NuxtLink to="/tournaments">Tous les tournois</NuxtLink>
            <br/>
            <NuxtLink to="/ranking">Classement</NuxtLink>
            <br>
            <div @click="loginUser">
                <p>test login</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import {Ref} from "vue";
import {User} from "~/composables/types";
const config = useRuntimeConfig();

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
                email: 'moyse94@gmail.com',
                password: 'admin'
            }
        }),
        transform: (res: any) => res.data.loginUser,
    });

    if (error?.value) console.error(error.value);
    if (data) return data as Ref<User>;
    else throw createError({statusCode: 404, message: 'La connection a échoué'});
}

</script>
