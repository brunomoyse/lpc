import { schema } from '#graphql/schema';
import { ApolloServer } from '@apollo/server';
import {H3ContextFunctionArgument, startServerAndCreateH3Handler} from '@as-integrations/h3';
import { resolvers } from '../graphql/resolvers';
const config = useRuntimeConfig();

// server/api/graphql.ts
import { MyContext } from '../graphql/context'
import jwt from 'jsonwebtoken'
import {IncomingMessage} from "http";

const SECRET_KEY = config.private.appSecret // Replace this with your actual secret key

const apollo = new ApolloServer({
    // Specify server options here
    typeDefs: schema,
    resolvers,
})

export default startServerAndCreateH3Handler(apollo, {
    context: ({event}): Promise<MyContext> => {
        const req = event.req as IncomingMessage
        const authHeader = req.headers.authorization
        let user
        //console.log(req.headers)
        if (authHeader) {
            const token = authHeader.split(' ')[1] // Extract the JWT from the "Bearer" token
            try {
                // Verify and decode the JWT to get the user
                const dataUser = jwt.verify(token, SECRET_KEY) as MyContext['user']
                if (dataUser) user = dataUser.user
            } catch (error: any) {
                //console.error('Invalid token:', error.message)
            }
        }

        return {
            // @ts-ignore
            event,
            user,
        }
    },
})
