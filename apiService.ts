import {Ref} from "vue";
import {Tournament, User} from "@prisma/client";

// @todo - useRuntimeConfig() is not working here
//const config = useRuntimeConfig();
let config = {
    public: {
        apiBase: "http://localhost:3000/api/graphql"
    }
}

//@ts-ignore
const authToken = localStorage.getItem('access-token');

export const useApiService = {
    getTournamentDetail: async (args: any): Promise<Ref<Tournament>> => {
        const tournamentId: string = args.tournamentId;
        const {data, pending, refresh, error} = await useFetch(config.public.apiBase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + authToken
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
    getTournaments: async (args: any): Promise<Ref<{ futureTournaments: [Tournament], pastTournaments: [Tournament] }>> => {
        const { paginationSettings } = args;
        let { data, pending, refresh, error } = await useFetch(config.public.apiBase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify({
                query: `query (
                $take: Int
                $skip: Int
                $userId: ID
                $startingRange: Date
                $endingRange: Date
            ) {
                futureTournaments: tournaments (
                    take: $take
                    skip: $skip
                    userId: $userId
                    startingRange: $startingRange
                ){
                    id
                    name
                    scheduledAt
                    lateRegistrationAt
                    imgPath
                    tournamentTags {
                        name
                    }
                }
                pastTournaments: tournaments (
                    take: $take
                    skip: $skip
                    userId: $userId
                    endingRange: $endingRange
                ){
                    id
                    name
                    scheduledAt
                    lateRegistrationAt
                    imgPath
                    tournamentTags {
                        name
                    }
                }
            }`,
                variables: {
                    take: paginationSettings.perPage,
                    skip: paginationSettings.skippedCount,
                    startingRange: new Date().toISOString(),
                    endingRange: new Date().toISOString()
                }
            }),
            transform: (res: any) => res.data,
        });
        if (error?.value) {
            if (error.value?.data?.message === 'Token expired') {
                await useFetch('/logout');
                //@ts-ignore
                localStorage.removeItem('access-token');
                navigateTo('/login');
            }
            console.error(error.value);
            throw createError({ statusCode: 404, message: 'Les tournois n\'ont pas été trouvés' });
        }
        if (data) return data;
        else throw createError({ statusCode: 404, message: 'Les tournois n\'ont pas été trouvés' });
    },
    registerTournament: async (args: any): Promise<Ref<Tournament>> => {
        const {tournamentId, userId} = args;
        const {data, pending, refresh, error} = await useFetch(config.public.apiBase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + authToken
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
                'Authorization': 'Bearer ' + authToken
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
    loginUser: async (args: any): Promise<any> => {
        const {email, password} = args;
        const {data, pending, refresh, error} = await useFetch(config.public.apiBase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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
                user {
                    id
                    lastName
                    firstName
                }
                token
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
        if (data) return data;
        else throw createError({statusCode: 500, message: 'La connection a échoué'});
    },

}

