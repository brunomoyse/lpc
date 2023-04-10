<template>
    <div>
        <div  class="grid grid-cols-2 gap-4">
            <h2 class="text-2xl font-bold mb-4">{{ tournament.name }}</h2>
            <div class="mb-7 flex justify-end">
                <button v-if="false" @click="displayUnsignUpModal" class="bg-gray-400 hover:bg-red-700 text-white font-bold py-2 px-4 mx-2 rounded">
                    Se désinscrire
                </button>
                <button v-else @click="displaySignUpModal" class="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 mx-2 rounded">
                    S'inscrire
                </button>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <!-- Block infos du tournoi -->
            <div>
                <!-- Début / Late reg-->
                <div class="grid grid-cols-2">
                    <!-- Début-->
                    <div class="mb-7">
                        <div class="text-lg font-semibold">Début</div>
                        <div v-if="tournament?.scheduledAt">{{ getDateFormatted(tournament.scheduledAt) }}</div>
                    </div>
                    <!-- Late reg -->
                    <div class="mb-7">
                        <div class="text-lg font-semibold">Inscr. tardives</div>
                        <div v-if="tournament?.scheduledAt">{{ getDateFormatted(tournament.lateRegistrationAt) }}</div>
                    </div>
                </div>

                <!-- Détail du tournoi -->
                <div class="mb-7">
                    <div class="text-lg font-semibold mb-2">Détail du tournoi</div>

                    <!-- Tags -->
                    <div class="grid grid-cols-2">
                        <!-- Buy-in -->
                        <div>
                            <div class="flex flex-row items-center mb-3">
                                <div class="mr-4">
                                    <nuxt-img
                                        alt="Buy-in amount"
                                        src="icons/cash.svg"
                                        format="svg"
                                        height="30px"
                                        width="30px"
                                    />
                                </div>
                                <div>{{ tournament.buyIn }}€ (+ 5€)</div>
                            </div>
                        </div>
                        <div v-for="tournamentTag in tournament.tournamentTags" :key="tournamentTag.id">
                            <div class="flex flex-row items-center mb-3">
                                <div class="mr-4">
                                    <nuxt-img
                                        :alt="tournamentTag.name"
                                        :src="tournamentTag.icon"
                                        format="svg"
                                        height="30px"
                                        width="30px"
                                    />
                                </div>
                                <div>{{ tournamentTag.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Players info -->
            <div>
                <!-- Les inscrits -->
                <div class="mb-7" v-if="tournament?.tournamentRegistrations && tournament.tournamentRegistrations.length > 0">
                    <div class="text-lg font-semibold mb-2">
                        Inscrits
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
                <!-- Payés -->
                <div class="mb-7" v-if="tournament?.tournamentResults && tournament.tournamentResults.length > 0">
                    <div class="text-lg font-semibold mb-2">
                        Payés
                    </div>
                    <div class="flex -space-x-4">
                        <template v-for="(registration, index) in tournament.tournamentResults">
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
            </div>
        </div>

        <modal-confirm
            :show="showModal"
            :title="modalTitle"
            :message="modalMessage"
            :confirmText="modalConfirm"
            :cancelText="modalCancel"
            @confirm="confirmModal"
            @cancel="cancelModal"/>

        <!-- Liste résulat -->
        <!--
        <div class="overflow-x-auto -mx-4" v-if="showTableResults">
            <table class="min-w-full bg-white divide-y divide-gray-200 shadow-md">
                <thead class="bg-gray-500 text-white">
                <tr>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider w-16">Pos.</th>
                    <th class="px-2 py-3 text-left text-xs font-bold uppercase tracking-wider">Joueur</th>
                    <th class="px-2 py-3 text-left text-xs font-bold uppercase tracking-wider">Résulat</th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="result in tournament.tournamentResults" :key="result.id">
                    <td class="px-2 py-4 whitespace-nowrap text-center w-16">{{ result.position }}</td>
                    <td class="px-2 py-4 whitespace-nowrap">{{ result.user.firstName + ' ' + result.user.lastName }}</td>
                    <td class="px-2 py-4 whitespace-nowrap">{{ formatPrize(result.prize) }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        -->
    </div>
</template>

<script lang="ts" setup>
// imports
import {Tournament} from "@prisma/client";
import {Ref} from "vue";
import ModalConfirm from "~/components/ModalConfirm.vue";

// data
const displayedRegistrations = 6;

const config = useRuntimeConfig();

const {params} = useRoute();
const tournamentId: string = params.id as string

let showTableResults = ref(false);

let showModal: Ref<boolean> = ref(false);
let modalTitle: Ref<string> = ref('');
let modalMessage: Ref<string> = ref('');
let modalConfirm: Ref<string> = ref('');
let modalCancel: Ref<string> = ref('');

// methods
const getTournament = async (tournamentId: string): Promise<Ref<Tournament>> => {
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
                    guaranteedPrizePool
                    reentry
                    multipleDays
                    imgPath
                    tournamentRegistrations {
                        id
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
                    tournamentTags {
                        id
                        name
                        icon
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

const signUpTournament = async (tournamentId: string) => {
    const userId = await getCurrentUserId();
    const {data, pending, refresh, error} = await useFetch(config.public.apiBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: `mutation (
                $tournamentId: ID!
                $userId: ID!
            ) {
                createTournamentRegistration (
                    tournamentId: $tournamentId
                    userId: $userId
                ){
                    id
                }
            }`,
            variables: {
                tournamentId: tournamentId,
                userId: userId
            }
        }),
        transform: (res: any) => res.data.createTournamentRegistration,
    });
    if (error?.value) console.error(error.value);
    if (data) return data;
    else throw createError({statusCode: 500, message: 'L\'inscription n\'a pas abouti'});
};

const unSignUpTournament = async (tournament: Tournament) => {
    const userId = await getCurrentUserId();
    // get last registration id in case of multiple registrations
    const lastRegistration = tournament.tournamentRegistrations.find(registration => registration.user.id === userId);

    const {data, pending, refresh, error} = await useFetch(config.public.apiBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: `mutation (
                $id: ID!
            ) {
                deleteTournamentRegistration (
                    id: $id
                ){
                    id
                }
            }`,
            variables: {
                id: lastRegistration.id
            }
        }),
        transform: (res: any) => res.data.deleteTournamentRegistration,
    });
    if (error?.value) console.error(error.value);
    if (data) return data;
    else throw createError({statusCode: 500, message: 'La désinscription n\'a pas abouti'});
};

const currentUserSignedUp = async (tournament: Tournament) => {
    const userId = await getCurrentUserId();
    const registrations = tournament.tournamentRegistrations;
    const userSignedUp = registrations.find(registration => registration.user.id === userId);
    console.log(!!userSignedUp);
    return !!userSignedUp;
}

const getCurrentUserId = async () => {
    // @todo get current user id
    return '894284da-cd7c-11ed-afa1-0242ac120002';
}

const displaySignUpModal = () => {
    modalTitle.value = 'Inscription au tournoi';
    modalMessage.value = 'Voulez-vous vous inscrire à ce tournoi?';
    modalConfirm.value = 'Confirmer';
    modalCancel.value = 'Annuler';
    showModal.value = true;
}

const displayUnsignUpModal = () => {
    modalTitle.value = 'Désinscription du tournoi';
    modalMessage.value = 'Voulez-vous annuler votre inscription à ce tournoi?';
    modalConfirm.value = 'Confirmer';
    modalCancel.value = 'Annuler';
    showModal.value = true;
}

const confirmModal = async () => {
    if (modalTitle.value === 'Inscription au tournoi')
        await signUpTournament(tournamentId);
    else if (modalTitle.value === 'Désinscription du tournoi') {
        await unSignUpTournament(tournament.value);
    }
    showModal.value = false;
}

const cancelModal = () => {
    showModal.value = false;
}

// utils
const getDateFormatted = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('fr-FR', {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    });
}

const formatPrize = (prize: number) => {
    return Math.floor(prize).toLocaleString('fr-BE', {style:"currency", currency:"EUR", minimumFractionDigits: 0});
}

// fetching data
const tournament: Ref<Tournament> = await getTournament(tournamentId);

</script>
