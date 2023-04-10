import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export const getTournaments = async ({
     take,
     skip,
     userId,
     startingRange,
     endingRange,
 }: {
    take: number;
    skip: number;
    userId?: string;
    startingRange?: Date;
    endingRange?: Date;
}) => {
    const baseQuery = {
        orderBy: {
            createdAt: "desc",
        },
        take,
        skip,
    };

    const whereConditions: any  = {
        ...(startingRange && {
            scheduledAt: {
                gte: startingRange,
            },
        }),
        ...(endingRange && {
            scheduledAt: {
                lte: endingRange,
            },
        }),
        ...(startingRange && endingRange && {
            scheduledAt: {
                gte: startingRange,
                lte: endingRange,
            },
        }),
        ...(userId && {
            tournamentRegistrations: {
                some: {
                    userId,
                },
            },
        }),
    };

    const includeConditions: any = {
        tournamentRegistrations: {
            include: {
                user: true,
            },
        },
        tournamentTags: true,
        ...(userId && {
            tournamentResults: {
                include: {
                    user: true,
                },
                where: { userId },
            },
        }),
        _count: {
            select: {
                tournamentRegistrations: true,
                tournamentResults: true
            }
        }
    };

    // @ts-ignore
    return await prisma.tournament.findMany({
        ...baseQuery,
        where: whereConditions,
        include: includeConditions,
    });
};

export const getTournament = async ({id}: {id: string}) => {
    return await prisma.tournament.findUnique({
        where: {
            id: id
        },
        include: {
            tournamentRegistrations: {
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            tournamentResults: {
                include: {
                    user: true
                },
                orderBy: {
                    position: 'asc'
                }
            },
            _count: {
                select: {
                    tournamentRegistrations: true,
                    tournamentResults: true
                }
            },
            tournamentTags: true
        }
    });
}

export const createTournament = async (args: any) => {
    // Extract tournamentTags from args and remove it from the object
    const { tournamentTags, ...tournamentData } = args;

    let createdTournament;

    createdTournament = await prisma.tournament.create({
        data: tournamentData,
        include: {
            tournamentRegistrations: true,
            tournamentResults: true,
            tournamentTags: true,
        }
    })


    // If tournamentTags are provided, create the relationships
    if (tournamentTags && tournamentTags.length > 0) {
        for (const tagId of tournamentTags) {
            await prisma.tournament.update({
                where: { id: createdTournament.id },
                data: {
                    tournamentTags: {
                        connect: {
                            id: tagId,
                        },
                    },
                },
                include: {
                    tournamentRegistrations: true,
                    tournamentResults: true,
                    tournamentTags: true,
                }
            });
        }
    }

    return getTournament({id: createdTournament.id})
}

export const updateTournament = async (args: any) => {
    return await prisma.tournament.update({
        where: {
            id: args.id
        },
        data: args
    })
}

export const createTournamentResult = async (args: any) => {
    // check if there is already an entry with the same user and tournament
    const existingResult = await prisma.tournamentResult.findFirst({
        where: {
            userId: args.userId,
            tournamentId: args.tournamentId
        }
    })

    if (existingResult) {
        throw new Error('There is already a result for this user and tournament')
    }

    return await prisma.tournamentResult.create({
        data: args,
        include: {
            user: true,
            tournament: true
        }
    })
}

export const deleteTournamentResult = async (args: any) => {
    return await prisma.tournamentResult.delete({
        where: {
            id: args.id
        }
    })
}

export const createTournamentRegistration = async (args: any) => {
    // check if the tournament has reentry
    const tournament = await prisma.tournament.findUnique({
        where: {
            id: args.tournamentId
        }
    });
    // if the tournament has no reentry possible
    if (!tournament?.reentry) {
        // check if the user already registered for this tournament
        const existingRegistration = await prisma.tournamentRegistration.findFirst({
            where: {
                userId: args.userId,
                tournamentId: args.tournamentId
            }
        });
        // if existingRegistration, then throw error
        if (existingRegistration) {
            throw new Error('The user already registered for this tournament, and reentry is not allowed')
        }
    }

    return await prisma.tournamentRegistration.create({
        data: args,
        include: {
            user: true,
            tournament: true
        }
    })
}

export const deleteTournamentRegistration = async (args: any) => {
    return await prisma.tournamentRegistration.delete({
        where: {
            id: args.id
        }
    })
}

export const createTournamentTag = async (args: any) => {
    return await prisma.tournamentTag.create({
        data: args
    })
}
