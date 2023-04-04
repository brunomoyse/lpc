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
                format="svg"
                :src="icon.path"
                :alt="icon.text"
                width="30px"
                height="30px"
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
                    class="w-12 h-12 rounded-full border-2 border-white hover:shadow-lg hover:scale-105 transform transition duration-300"
                    :src="'/users/avatar_' + (index + 1) + '.png'"
                    alt=""
                    :title="registration.user.firstName + ' ' + registration.user.lastName"
                >
            </template>
            <a
                class="flex justify-center items-center w-12 h-12 text-xs font-medium bg-gray-300 rounded-full border-2 border-white hover:bg-gray-600"
                v-if="tournament._count.tournamentRegistrations > displayedRegistrations"
            >
                + {{ tournament._count.tournamentRegistrations - displayedRegistrations }}
            </a>

            <!--
			  <img class="w-12 h-12 rounded-full border-2 border-white" src="/users/avatar_1.png" alt="">
			  <img class="w-12 h-12 rounded-full border-2 border-white" src="/users/avatar_2.png" alt="">
			  <img class="w-12 h-12 rounded-full border-2 border-white" src="/users/avatar_3.png" alt="">
			  <img class="w-12 h-12 rounded-full border-2 border-white" src="/users/avatar_4.png" alt="">
			  <img class="w-12 h-12 rounded-full border-2 border-white" src="/users/avatar_5.png" alt="">
			  <img class="w-12 h-12 rounded-full border-2 border-white" src="/users/avatar_6.png" alt="">
			  <a class="flex justify-center items-center w-12 h-12 text-xs font-medium bg-gray-300 rounded-full border-2 border-white hover:bg-gray-600" href="#">+99</a>
			  -->
        </div>
      </div>

      <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
        S'inscrire
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { Tournament } from "@prisma/client";
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

const { params } = useRoute();
const tournamentId: string = params.id as string

// methods
const getTournament = async (tournamentId: string): Promise<Ref> => {
    let { data, pending, refresh, error } = await useFetch('http://localhost:3000/api/graphql', {
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
    else throw createError({ statusCode: 404, message: 'Le tournoi n\'a pas été trouvé' });
};

const getDateFormated = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('fr-FR', {weekday: "long", year: 'numeric', month: "long", day: 'numeric', hour: 'numeric', minute: 'numeric'});
}

const getHourOnly = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('fr-FR', {hour: 'numeric', minute: 'numeric'});
}

// fetching data
const tournament: Ref<Tournament> = await getTournament(tournamentId);

</script>
