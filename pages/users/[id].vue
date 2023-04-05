<template>
    <div>
        <h2>
            {{ player.firstName }} {{ player.lastName }}
        </h2>
    </div>
</template>

<script setup lang="ts">

import {Ref} from "vue";
import {Tournament, User} from "@prisma/client";

const {params} = useRoute();
const userId: string = params.id as string

const getUser = async (userId: string) => {
    const {data, pending, refresh, error} = await useFetch('http://localhost:3000/api/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: `query (
            $id: ID!
        ) {
            user (
                id: $id
            ){
                id
                createdAt
                updatedAt
                email
                password
                lastName
                firstName
                nickName
                isMember
                team {
                    name
                }
                tournamentRegistrations {
                    id
                }
                tournamentResults {
                    id
                }
            }
        }`,
            variables: {
                id: userId
            }
        }),
        transform: (res: any) => res.data.user,
    });

    if (error?.value) console.error(error.value);
    if (data) return data as Ref<User>;
    else throw createError({statusCode: 404, message: 'L\'utilisateur n\'a pas été trouvé'});

}

// fetching data
const player: Ref<User> = await getUser(userId);


</script>
