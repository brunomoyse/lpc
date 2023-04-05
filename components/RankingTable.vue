<template>
    <div class="flex flex-col mt-6">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden sm:rounded-lg">
                    <table class="min-w-full text-sm">
                        <thead class="bg-gray-600 text-xs uppercase font-medium text-white">
                        <tr>
                            <th></th>
                            <th scope="col" class="px-6 py-3 text-left tracking-wider">
                                Joueur
                            </th>
                            <th scope="col" class="px-6 py-3 text-left tracking-wider">
                                TP
                            </th>
                            <th scope="col" class="px-6 py-3 text-left tracking-wider">
                                ITM
                            </th>
                            <th scope="col" class="px-6 py-3 text-left tracking-wider">
                                TF
                            </th>
                            <th scope="col" class="px-6 py-3 text-left tracking-wider">
                                Victoires
                            </th>
                            <th scope="col" class="px-6 py-3 text-left tracking-wider">
                                Last 5
                            </th>
                        </tr>
                        </thead>
                        <tbody class="bg-gray-100">
                        <tr
                                v-for="(player, index) in players"
                                :key="player.id"
                                :class="index % 2 === 1 ? 'bg-black bg-opacity-10' : ''"
                                @click="goToPlayerDetails(player)"
                        >
                            <td class="pl-4">
                                {{ player.position }}
                            </td>
                            <td class="flex px-6 py-4 whitespace-nowrap">
                                <img
                                        class="w-5 h-5 rounded-full"
                                        :src="'/users/avatar_' + (index + 1) + '.png'"
                                        :alt="'Avatar de ' + player.firstName + ' ' + player.lastName"
                                        :title="player.firstName + ' ' + player.lastName"
                                >
                                <span class="ml-2 font-medium">
                                            {{ player.firstName + ' ' + player.lastName }}
                                        </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                {{ getTournamentsPlayed(player.tournamentRegistrations) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                {{ player.tournamentResults.length }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                {{ getTournamentFinals(player.tournamentResults) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                {{ getTournamentWins(player.tournamentResults) }}
                            </td>
                            <td class="flex px-6 py-4 whitespace-nowrap">
                                <template v-for="recentGame in checkResults(player.tournamentRegistrations, player.tournamentResults)" :key="player.tournamentRegistrations.id">
                                    <svg v-if="recentGame === 'ITM'" class="w-4 fill-current text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" title="ITM">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>
                                    <svg v-else-if="recentGame === 'TF'" class="w-4 fill-current text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" title="TF">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>
                                    <svg v-else-if="recentGame === 'V'" class="w-4 fill-current text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" title="Vainqueur">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                    </svg>
                                    <svg v-else class="w-4 fill-current text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                                    </svg>
                                </template>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="mt-4 flex justify-between">
                        <button
                                @click="prevPage"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                :disabled="paginationSettings.skippedCount === 0"
                        >
                            Previous
                        </button>
                        <button
                                @click="nextPage"
                                :disabled="!hasMoreData"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// imports
import { User, TournamentRegistration } from "@prisma/client";
import {Ref} from "vue";

const router = useRouter();

// data
const paginationSettings = reactive({
    perPage: 3,
    skippedCount : 0,
});

const nextPage = async () => {
    if (players.value.length < paginationSettings.perPage) {
        hasMoreData.value = false;
    }
    if (hasMoreData.value === false) return;
    paginationSettings.skippedCount += paginationSettings.perPage;
    const newPlayers = await getUsers();

    if (newPlayers.value.length === 0) {
        hasMoreData.value = false;
        return;
    } else {
        players = newPlayers;
    }
    if (players.value.length < paginationSettings.perPage) {
        hasMoreData.value = false;
    }
};

const prevPage = async () => {
    if (paginationSettings.skippedCount === 0) return;
    paginationSettings.skippedCount -= paginationSettings.perPage;
    hasMoreData.value = true;
    players = await getUsers();
};


// methods
const getUsers = async (): Promise<Ref> => {
    let { data, pending, refresh, error } = await useFetch('http://localhost:3000/api/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: `query (
                $take: Int
                $skip: Int
            ) {
                users (
                    take: $take
                    skip: $skip
                ){
                    id
                    firstName
                    lastName
                    nickName
                    isMember
                    tournamentRegistrations {
                        id
                        tournament {
                            id
                        }
                    }
                    tournamentResults {
                        id
                        position
                        prize
                        tournament {
                            id
                        }
                    }
                }
            }`,
            variables: {
                take: paginationSettings.perPage,
                skip: paginationSettings.skippedCount,
            }
        }),
        transform: (res: any) => {
            // add position to users depending on the current page
            res.data.users.forEach((user: any, index: number) => {
                user.position = index + 1 + paginationSettings.skippedCount;
            });
            return res.data.users
        }
    });
    if (error?.value) console.error(error.value);
    if (data) return data as Ref<User>;
    else throw createError({ statusCode: 404, message: 'Les utilisateurs n\'ont pas été trouvés' });
};

let players = await getUsers();

const goToPlayerDetails = (player: User) => {
    router.push(`/users/${player.id}`);
};

const getTournamentFinals = (tournamentResults: any) => {
    let finals = 0;
    tournamentResults.forEach((tournamentResult: any) => {
        if (tournamentResult.position < 10) finals++;
    });
    return finals;
}

const getTournamentWins = (tournamentResults: any) => {
    let wins = 0;
    tournamentResults.forEach((tournamentResult: any) => {
        if (tournamentResult.position === 1) wins++;
    });
    return wins;
}

const getTournamentsPlayed = (tournamentRegistrations: any) => {
    // filter tournamentRegistrations to get a single item per tournament.id property
    let uniqueTournamentIds: string[] = [];
    const uniqueTournaments = tournamentRegistrations.filter((registration: TournamentRegistration) => {
       if (uniqueTournamentIds.includes(registration.tournament.id)) return false;
        uniqueTournamentIds.push(registration.tournament.id);
        return true;
    });

    return uniqueTournaments.length;
}

const checkResults = (tournamentRegistrations: any, tournamentResults: any) => {
    tournamentRegistrations = tournamentRegistrations.slice(0, 20);
    tournamentResults = tournamentResults.slice(0, 5);

    let results: string[] = [];

    tournamentRegistrations.forEach((tournamentRegistration: any, index: number) => {
        let resultForRegistration = 'N';

        // If the previous registration is for the same tournament, set the result as 'N' and skip the result processing
        if (index > 0 && tournamentRegistrations[index - 1].tournament.id === tournamentRegistration.tournament.id) {
            // If we want to show all the entries for a tournament, we can use the following line
            //results.push(resultForRegistration);
            return;
        }

        tournamentResults.some((tournamentResult: any) => {
            if (tournamentResult.tournament.id === tournamentRegistration.tournament.id) {
                if (tournamentResult.position === 1) resultForRegistration = 'V';
                else if (tournamentResult.position < 10) resultForRegistration = 'TF';
                else resultForRegistration = 'ITM';
                return true;
            }
            return false;
        });

        results.push(resultForRegistration);
    });

    return results.slice(0, 5);
}

let hasMoreData = ref(!(players.value.length < paginationSettings.perPage));

</script>
