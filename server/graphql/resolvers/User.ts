import { PrismaClient } from '@prisma/client'
import {
    hashPassword,
    comparePasswords
} from "~/composables/passwordUtils";
const prisma = new PrismaClient()

export const getUsers = async ({ take, skip }: { take: number, skip: number }) => {
    const users = await prisma.user.findMany({
        include: {
            role: true,
            team: true,
            tournamentRegistrations: {
                include: {
                    tournament: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            },
            tournamentResults: {
                include: {
                    tournament: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            },
            cashGamePlayed: true,
            cashGameOrganized: true,
        },
        take,
        skip,
    });
    return users.sort((a, b) => {
        return b.tournamentResults.length - a.tournamentResults.length;
    });
}

export const getUser = async ({id}: {id: string}) => {
    return await prisma.user.findUnique({
        where: {
            id: id
        },
        include: {
            role: true,
            team: true,
            tournamentRegistrations: {
                include: {
                    tournament: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            },
            tournamentResults: {
                include: {
                    tournament: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            },
            cashGamePlayed: true,
            cashGameOrganized: true,
        }
    })
}

export const createUser = async (args: any) => {
    const { password, ...rest } = args;
    const hashedPassword = await hashPassword(password);

    return await prisma.user.create({
        data: {
            ...rest,
            password: hashedPassword,
        }
    })
}
