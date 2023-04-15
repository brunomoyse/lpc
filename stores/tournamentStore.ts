import {defineStore} from "pinia";
import {useApiService} from "@/apiService";

export const useTournamentStore = defineStore({
    id: "tournamentStore",
    state: () => ({
        tournaments: [],
        tournament: {},
    }),
    actions: {
        async getTournamentDetail(args: any) {
            const tournament = await useApiService.getTournamentDetail(args);
            if (tournament) this.tournament = tournament;
        },
        async registerTournament(args: any) {
            const updatedTournament = await useApiService.registerTournament(args);
            if (updatedTournament) this.tournament = updatedTournament;
        },
        async unregisterTournament(args: any) {
            const updatedTournament = await useApiService.unregisterTournament(args);
            if (updatedTournament) this.tournament = updatedTournament;
        }

    }
})
