import {PrismaClient, User} from '@prisma/client'
import {
    hashPassword,
    comparePasswords
} from "~/composables/passwordUtils";

const config = useRuntimeConfig();
import {setCookie, H3Event, H3EventContext} from 'h3'

import pkg from 'jsonwebtoken/index.js';
const { sign } = pkg;

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


export const loginUser = async (parent: any, args: any, context: any, event: any) => {
    const { email, password } = args;

    const user: User|null = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (user === null) {
        throw new Error('No user found');
    }

    const valid: boolean = await comparePasswords(password, user.password);

    if (!valid) {
        throw new Error('Invalid password');
    }

    const refreshToken = sign({ user: user }, config.private.appSecret, { expiresIn: '7d' });
    const accessToken = sign({ user: user }, config.private.appSecret, { expiresIn: '1d' });

    setCookie(context.event, 'refresh-token', refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    })
    setCookie(context.event, 'access-token', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    });
    console.log('test')
    return user;
}
