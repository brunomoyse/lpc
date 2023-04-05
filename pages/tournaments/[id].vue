<template>
    <div>
        <h2 class="text-2xl font-bold mb-4">{{ tournament.name }}</h2>
        <div>
            <div class="mb-7">
                <div class="text-lg font-semibold">Début</div>
                <div v-if="tournament?.scheduledAt">{{ getDateFormated(tournament.scheduledAt) }}</div>
            </div>

            <div class="mb-7">
                <div class="text-lg font-semibold mb-2">Détail du tournoi</div>
                <div v-for="(icon, index) in icons" :key="index">
                    <div class="flex flex-row items-center mb-3">
                        <div class="mr-4">
                            <nuxt-img
                                    :alt="icon.text"
                                    :src="icon.path"
                                    format="svg"
                                    height="30px"
                                    width="30px"
                            />
                        </div>
                        <div>{{ icon.text }}</div>
                    </div>
                </div>
            </div>

            <div class="mb-7">
                <div class="text-lg font-semibold mb-2">
                    Les inscrits
                </div>
                <div class="flex -space-x-4">
                    <template v-for="(registration, index) in tournament.tournamentRegistrations">
                        <img
                                v-if="index < displayedRegistrations"
                                :src="'/users/avatar_' + (index + 1) + '.png'"
                                :title="registration.user.firstName + ' ' + registration.user.lastName"
                                alt=""
                                class="w-12 h-12 rounded-full border-2 border-white hover:shadow-lg hover:scale-105 transform transition duration-300"
                        >
                    </template>
                    <a
                            v-if="tournament._count.tournamentRegistrations > displayedRegistrations"
                            class="flex justify-center items-center w-12 h-12 text-xs font-medium bg-gray-300 rounded-full border-2 border-white hover:bg-gray-600"
                    >
                        + {{ tournament._count.tournamentRegistrations - displayedRegistrations }}
                    </a>
                </div>
            </div>

            <div class="mb-7 flex justify-around">
                <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mx-2 rounded">
                    S'inscrire
                </button>
                <button @click="toggleResultsTable" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mx-2 rounded">
                    Résultats
                </button>
            </div>

            <div class="overflow-x-auto" v-if="showTableResults">
                <table class="min-w-full bg-white divide-y divide-gray-200 shadow-md">
                    <thead class="bg-gray-500 text-white">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Pos.</th>
                            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Joueur</th>
                            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Résulat</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="result in tournament.tournamentResults" :key="result.id">
                            <td class="px-6 py-4 whitespace-nowrap">{{ result.position }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ result.user.firstName + ' ' + result.user.lastName }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ result.prize }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// imports
import {Tournament} from "@prisma/client";
import {Ref} from "vue";

// data
const icons = [
    {
        title: 'buyin',
        text: '25€ + 5€',
        path: `icons/cash.svg`
    },
    {
        title: 'sixmax',
        text: '6-max',
        path: `icons/group.svg`
    },
    {
        title: 'bounty',
        text: 'Tournoi bounty',
        path: `icons/target.svg`
    },

];
const displayedRegistrations = 6;

const {params} = useRoute();
const tournamentId: string = params.id as string

let showTableResults = ref(false);

// methods
const getTournament = async (tournamentId: string): Promise<Ref> => {
    let {data, pending, refresh, error} = await useFetch('http://localhost:3000/api/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: `query (
                $id: ID!
            ) {
                tournament (
                    id: $id
                ){
                    id
                    name
                    scheduledAt
                    lateRegistrationAt
                    name
                    buyIn
                    maxRegistrations
                    prizePool
                    reentry
                    multipleDays
                    imgPath
                    tournamentRegistrations {
                        user {
                            id
                            firstName
                            lastName
                        }
                    }
                    tournamentResults {
                        position
                        prize
                        user {
                            id
                            firstName
                            lastName
                        }
                    }
                    _count {
                        tournamentRegistrations
                    }
                }
            }`,
            variables: {
                id: tournamentId
            }
        }),
        transform: (res: any) => res.data.tournament,
    });
    if (error?.value) console.error(error.value);
    if (data) return data as Ref<Tournament>;
    else throw createError({statusCode: 404, message: 'Le tournoi n\'a pas été trouvé'});
};

const getDateFormated = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('fr-FR', {
        weekday: "long",
        year: 'numeric',
        month: "long",
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
}

const getHourOnly = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('fr-FR', {hour: 'numeric', minute: 'numeric'});
}

const toggleResultsTable = () => {
    showTableResults.value = !showTableResults.value;
}

// fetching data
const tournament: Ref<Tournament> = await getTournament(tournamentId);

</script>
