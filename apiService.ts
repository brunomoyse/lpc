import {Ref} from "vue";
import {Tournament, User} from "@prisma/client";
// @todo - useRuntimeConfig() is not working here
//const config = useRuntimeConfig();
let config = {
    public: {
        apiBase: "http://localhost:3000/api/graphql"
    }
}
export const useApiService = {
    getTournamentDetail: async (args: any): Promise<Ref<Tournament>> => {
        const tournamentId: string = args.tournamentId;
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
    },
    registerTournament: async (args: any): Promise<Ref<Tournament>> => {
        const {tournamentId, userId} = args;
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
                    tournamentId: tournamentId,
                    userId: userId
                }
            }),
            transform: (res: any) => res.data.createTournamentRegistration,
        });
        if (error?.value) console.error(error.value);
        if (data) return data as Ref<Tournament>;
        else throw createError({statusCode: 500, message: 'L\'inscription n\'a pas abouti'});
    },
    unregisterTournament: async (args: any): Promise<Ref<Tournament>> => {
        const {tournamentId, userId} = args;
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
                deleteTournamentRegistration (
                    tournamentId: $tournamentId
                    userId: $userId
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
                    tournamentId: tournamentId,
                    userId: userId
                }
            }),
            transform: (res: any) => res.data.deleteTournamentRegistration,
        });
        if (error?.value) console.error(error.value);
        if (data) return data as Ref<Tournament>;
        else throw createError({statusCode: 500, message: 'La désinscription n\'a pas abouti'});
    },
    loginUser: async (args: any): Promise<Ref<User>> => {
        const {email, password} = args;
        const {data, pending, refresh, error} = await useFetch(config.public.apiBase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `mutation LoginUser(
            $email: String!
            $password: String!
        ) {
            loginUser (
                email: $email
                password: $password
            ){
                id
                lastName
                firstName
            }
        }`,
                variables: {
                    email: email,
                    password: password
                }
            }),
            transform: (res: any) => res.data.loginUser,
        });

        if (error?.value) console.error(error.value);
        if (data) return data as Ref<User>;
        else throw createError({statusCode: 500, message: 'La connection a échoué'});
    }
}

