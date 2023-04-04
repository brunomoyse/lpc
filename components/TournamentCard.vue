<template>
    <nuxt-link class="flex flex-row my-4 mr-4 rounded-xl hover:bg-gray-100 cursor-pointer" :to="'/tournaments/' + tournament.id">
        <picture>
            <source :srcSet="tournament.imgPath + '.avif'" type="image/avif" />
            <source :srcSet="tournament.imgPath + '.webp'" type="image/webp" />
            <nuxt-img
                :src="tournament.imgPath + '.png'"
                :alt="getTournamentDescription(tournament.name)"
                class="object-cover rounded-lg h-24 w-24 mr-3"
                width="96px"
                height="96px"
            />
        </picture>

        <div class="h-24 flex flex-col justify-around">
            <h4 class="font-bold">{{ tournament.name }}</h4>
            <div v-if="tournament.scheduledAt">
                {{ getDateFormated(tournament.scheduledAt) }}
            </div>
            <div v-if="tournament.lateRegistrationAt">
                Inscr. tardives - {{  getHourOnly(tournament.lateRegistrationAt) }}
            </div>
        </div>
    </nuxt-link>
</template>

<script setup lang="ts">

import { Tournament } from '@prisma/client';
import { PropType } from 'vue';

const props = defineProps({
    tournament: {
        type: Object as PropType<Tournament>,
        required: true
    }
})

const getDateFormated = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('fr-FR', {weekday: 'short', /*year: 'numeric',*/ month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'});
}

const getHourOnly = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('fr-FR', {hour: 'numeric', minute: 'numeric'});
}

const getTournamentDescription = (name: string) => {
    return 'Liège Poker Club - Tournoi ' + name;
}

</script>
