<template>
    <div>
        <div  class="grid grid-cols-2 gap-4">
            <h2 class="text-2xl font-bold mb-4">{{ tournament.name }}</h2>
            <div class="mb-7 flex justify-end">
                <button v-if="isCurrentUserSignedUp" @click="displayUnregisterModal" class="bg-gray-400 hover:bg-red-700 text-white font-bold py-2 px-4 mx-2 rounded">
                    Se désinscrire
                </button>
                <button v-else @click="displayRegisterModal" class="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 mx-2 rounded">
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
import {Tournament, TournamentRegistration} from "@prisma/client";
import {Ref, computed} from "vue";
import ModalConfirm from "~/components/ModalConfirm.vue";
import { useTournamentStore } from "@/stores/tournamentStore";

const tournamentStore = useTournamentStore();

// data
const displayedRegistrations = 6;

const config = useRuntimeConfig();

const {params} = useRoute();
const tournamentId: string = params.id as string
await tournamentStore.getTournamentDetail({tournamentId});
// @todo make it with a computed property
//const tournament = computed(() => tournamentStore.tournament);
let tournament: Ref<Tournament> | Ref<{}> = ref(tournamentStore.tournament);

let showTableResults = ref(false);
const currentUserId = ref('894284da-cd7c-11ed-afa1-0242ac120002');// @todo makes it with the store

let showModal: Ref<boolean> = ref(false);
let modalTitle: Ref<string> = ref('');
let modalMessage: Ref<string> = ref('');
let modalConfirm: Ref<string> = ref('');
let modalCancel: Ref<string> = ref('');

// methods
const registerTournament = async (tournamentId: string) => {
    const userId = currentUserId.value;
    await tournamentStore.registerTournament({tournamentId, userId});
    tournament.value = tournamentStore.tournament;
};

const unregisterTournament = async (tournamentId: string) => {
    const userId = currentUserId.value;
    await tournamentStore.unregisterTournament({tournamentId, userId});
    tournament.value = tournamentStore.tournament;
};

const isCurrentUserSignedUp = computed(() => {
    const registrations = tournament.value.tournamentRegistrations;
    if (!registrations) return false;
    return registrations.some((registration: TournamentRegistration) => registration.user.id === currentUserId.value);
});

const displayRegisterModal = () => {
    modalTitle.value = 'Inscription au tournoi';
    modalMessage.value = 'Voulez-vous vous inscrire à ce tournoi?';
    modalConfirm.value = 'Confirmer';
    modalCancel.value = 'Annuler';
    showModal.value = true;
}

const displayUnregisterModal = () => {
    modalTitle.value = 'Désinscription du tournoi';
    modalMessage.value = 'Voulez-vous annuler votre inscription à ce tournoi?';
    modalConfirm.value = 'Confirmer';
    modalCancel.value = 'Annuler';
    showModal.value = true;
}

const confirmModal = async () => {
    if (modalTitle.value === 'Inscription au tournoi')
        await registerTournament(tournamentId);
    else if (modalTitle.value === 'Désinscription du tournoi') {
        await unregisterTournament(tournamentId);
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

</script>
