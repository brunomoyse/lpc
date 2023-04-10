import {Resolvers} from "#graphql/resolver";
import {
    getTournaments,
    getTournament,
    createTournament,
    createTournamentResult,
    createTournamentRegistration,
    createTournamentTag,
    updateTournament,
    deleteTournamentRegistration,
    deleteTournamentResult,
} from "./resolvers/Tournament";
import {
    getUsers,
    getUser,
    createUser,
} from "./resolvers/User";

export const resolvers: Resolvers = {
    Query: {
        // @ts-ignore
        tournaments: async (parent, args, context, info) => {
            // Check if startingRange is before endingRange
            if (
                args?.startingRange !== undefined &&
                args?.endingRange !== undefined &&
                new Date(args?.startingRange) >= new Date(args?.endingRange)
            ) {
                throw new Error(
                    "startingRange must be before endingRange."
                );
            }
            // @ts-ignore
            return await getTournaments(args)
        },
        // @ts-ignore
        tournament: async (parent, args, context, info) => {
            return await getTournament(args)
        },
        // @ts-ignore
        users: async (parent, args, context, info) => {
            return await getUsers(args)
        },
        // @ts-ignore
        user: async (parent, args, context, info) => {
            return await getUser(args)
        }
    },
    Mutation: {
        // @ts-ignore
        createTournament: async (parent, args, context, info) => {
            return await createTournament(args);
        },

        // @ts-ignore
        updateTournament: async (parent, args, context, info) => {
            return await updateTournament(args);
        },

        // @ts-ignore
        createTournamentResult: async (parent, args, context, info) => {
            return await createTournamentResult(args);
        },

        // @ts-ignore
        deleteTournamentResult: async (parent, args, context, info) => {
            return await deleteTournamentResult(args);
        },

        // @ts-ignore
        createTournamentRegistration: async (parent, args, context, info) => {
            const tournament = await getTournament({id: args.tournamentId});
            if (tournament?.scheduledAt && new Date(tournament.scheduledAt) <= new Date()) {
                throw new Error("Le tournoi a déjà débuté");
            }
            return await createTournamentRegistration(args);
        },

        // @ts-ignore
        deleteTournamentRegistration: async (parent, args, context, info) => {
            const tournament = await getTournament({id: args.tournamentId});
            if (tournament?.scheduledAt && new Date(tournament.scheduledAt) <= new Date()) {
                throw new Error("Le tournoi a déjà débuté");
            }
            return await deleteTournamentRegistration(args);
        },

        // @ts-ignore
        createUser: async (parent, args, context, info) => {
            return await createUser(args)
        },

        // @ts-ignore
        createTournamentTag: async (parent, args, context, info) => {
            return await createTournamentTag(args)
        }
    }
}
