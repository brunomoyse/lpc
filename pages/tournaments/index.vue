<template>
    <div>
        <h2 class="text-2xl font-bold mb-4">Tournois</h2>
        <h3 class="text-xl font-semibold">Tournois à venir</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-8">
            <tournament-card
                v-for="futureTournament in tournaments.futureTournaments"
                :key="futureTournament.id"
                :tournament="futureTournament"
            />
        </div>
        <h3 class="text-xl font-semibold">Tournois passés</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-8">
            <tournament-card
                v-for="pastTournament in tournaments.pastTournaments"
                :key="pastTournament.id"
                :tournament="pastTournament"
            />
        </div>

    </div>
</template>

<script setup lang="ts">
    // imports
    import { Tournament } from "@/composables/types";
    import {useApiService} from "~/apiService";

    const config = useRuntimeConfig();

    // data
    const paginationSettings = {
        perPage: 4,
        skippedCount : 0,
    }

    // fetching data
    let tournaments: Ref<{futureTournaments: [Tournament], pastTournaments: [Tournament]}> = await useApiService.getTournaments({paginationSettings});


</script>
