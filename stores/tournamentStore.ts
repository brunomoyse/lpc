import {defineStore} from "pinia";
// import apiService.ts
import {useApiService} from "@/composables/apiService";

export const useTournamentStore = defineStore({
    id: "tournamentStore",
    state: () => ({
        tournaments: [],
        tournament: {},
    }),
    actions: {
        async getTournamentDetail(args: any) {
            this.tournament = await useApiService.getTournamentDetail(args);
        },
        async registerTournament(args: any) {
            this.tournament = await useApiService.registerTournament(args);
        },
        async unregisterTournament(args: any) {
            this.tournament = await useApiService.unregisterTournament(args);
        }

    }
})
