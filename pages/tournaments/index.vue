<template>
    <div>
        <h2 class="text-2xl font-bold mb-4">Tournois</h2>
        <h3 class="text-xl font-semibold">Tournois à venir</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-8">
            <tournament-card
                v-for="futureTournament in tournaments"
                :key="futureTournament.id"
                :tournament="futureTournament"
            />
        </div>
        <h3 class="text-xl font-semibold">Tournois passés</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-8">
            <tournament-card
                v-for="pastTournament in tournaments"
                :key="pastTournament.id"
                :tournament="pastTournament"
            />
        </div>

    </div>
</template>

<script setup lang="ts">
    // imports
    import { Tournament } from "@prisma/client";

    const config = useRuntimeConfig();

    // data
    const paginationSettings = {
        perPage: 5,
        skippedCount : 0,
    }

    // methods
    const getTournaments = async (): Promise<[Tournament]> => {
        let { data, pending, refresh, error } = await useFetch(config.public.apiBase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `query (
                $take: Int
                $skip: Int
                $userId: ID
                $startingRange: Date
                $endingRange: Date
            ) {
                tournaments (
                    take: $take
                    skip: $skip
                    userId: $userId
                    startingRange: $startingRange
                    endingRange: $endingRange
                ){
                    id
                    name
                    scheduledAt
                    lateRegistrationAt
                    imgPath
                }
            }`,
                variables: {
                    take: paginationSettings.perPage,
                    skip: paginationSettings.skippedCount,
                }
            })
        });
        if (error?.value) console.log(error.value);
        if (data?.value?.data?.tournaments) return data.value.data.tournaments as [Tournament];
        else throw createError({ statusCode: 404, message: 'Les tournois n\'ont pas été trouvés' });
    };

    // fetching data
    let tournaments = await getTournaments();

</script>
