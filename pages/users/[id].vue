<template>
    <div>
        <!-- Player's name-->
        <h2 class="text-center text-3xl font-bold">
            {{ player.firstName }} {{ player.lastName.toUpperCase() }}
        </h2>

        <!-- Main win/results-->
        <div class="my-8">
            <div class="grid grid-cols-2">
                <div class="rounded-xl border border-gray-500 p-6 mr-3">
                    <div class="text-center text-2xl mb-1">
                        {{ getTotalEarnings(player.tournamentResults) }}
                    </div>
                    <div class="text-center text-sm">
                        Total gagné
                    </div>
                </div>
                <div class="rounded-xl border border-gray-500 p-6 ml-3">
                    <div class="text-center text-2xl mb-1">
                        {{ getBestCash(player.tournamentResults) }}
                    </div>
                    <div class="text-center text-sm">
                        Meilleur résulat
                    </div>
                </div>
            </div>
        </div>

        <!-- History -->
        <div class="flex flex-col mt-6 -mx-4">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow overflow-hidden sm:rounded-lg">
                        <table class="min-w-full text-sm">
                            <thead class="bg-gray-600 text-xs uppercase font-medium text-white">
                            <tr>
                                <th scope="col" class="px-3 py-3 text-left tracking-wider">
                                    Date
                                </th>
                                <th scope="col" class="px-3 py-3 text-left tracking-wider">
                                    Tournoi
                                </th>
                                <th scope="col" class="px-3 py-3 text-left tracking-wider">
                                    Pos.
                                </th>
                                <th scope="col" class="px-3 py-3 text-left tracking-wider">
                                    Rés.
                                </th>
                            </tr>
                            </thead>
                            <tbody class="bg-gray-100">
                            <tr
                                v-for="(result, index) in orderResults(player.tournamentResults)"
                                :key="result.id"
                                :class="index % 2 === 1 ? 'bg-black bg-opacity-10' : ''"
                            >
                                <td class="px-3 py-4 whitespace-nowrap">
                                    <div>{{ getDateFormattedDay(result?.tournament?.scheduledAt) }}
                                        {{ getDateFormattedMonth(result?.tournament?.scheduledAt) }}</div>
                                    <div>{{ getDateFormattedYear(result?.tournament?.scheduledAt) }}</div>
                                </td>
                                <td class="px-3 py-4 whitespace-nowrap">
                                    {{ result?.tournament?.name }}
                                </td>
                                <td class="px-3 py-4 whitespace-nowrap">
                                    {{
                                        result?.position && result.position === 1
                                            ? result.position + 'er'
                                            : result.position + 'e'
                                    }}
                                </td>
                                <td class="px-3 py-4 whitespace-nowrap">
                                    {{ result?.prize + '€' }}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import {Ref} from "vue";
import {Tournament, User, TournamentResult} from "@prisma/client";

const config = useRuntimeConfig();

const {params} = useRoute();
const userId: string = params.id as string

const getUser = async (userId: string) => {
    const {data, pending, refresh, error} = await useFetch(config.public.apiBase, {
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
                    prize
                    position
                    tournament {
                        id
                        name
                        scheduledAt
                    }
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

const getTotalEarnings = (results: TournamentResult[]) => {
    // make the sum of all the result.prize
    let totalEarnings = 0;
    results.forEach(result => {
        if (result?.prize !== null) totalEarnings += result?.prize;
    });
    return Math.floor(totalEarnings).toLocaleString('fr-BE', {style:"currency", currency:"EUR", minimumFractionDigits: 0});
};

const getBestCash = (results: TournamentResult[]) => {
    // make the sum of all the result.prize
    let bestCash = 0;
    results.forEach(result => {
        if (result?.prize !== null && result.prize > bestCash) bestCash = result?.prize;
    });
    return Math.floor(bestCash).toLocaleString('fr-BE', {style:"currency", currency:"EUR", minimumFractionDigits: 0});
};

const orderResults = (results: TournamentResult[]) => {
    return results.sort((a, b) => {
        return new Date(b.tournament.scheduledAt).getTime() - new Date(a.tournament.scheduledAt).getTime();
    });
}

const getDateFormattedYear = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('fr-FR', {
        year: 'numeric'
    });
}
const getDateFormattedMonth = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('fr-FR', {
        month: "short"
    });
}
const getDateFormattedDay = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('fr-FR', {
        day: 'numeric'
    });
}

// fetching data
const player: Ref<User> = await getUser(userId);


</script>
