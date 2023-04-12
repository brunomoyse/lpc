import { schema } from '#graphql/schema';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateH3Handler, H3ContextFunctionArgument } from '@as-integrations/h3';
import { resolvers } from '../graphql/resolvers';

interface MyContext {
    event: H3ContextFunctionArgument;
}

const apollo = new ApolloServer<MyContext>({
    typeDefs: schema,
    resolvers,
});

const handler = startServerAndCreateH3Handler(apollo, {
    context: async (event: H3ContextFunctionArgument): Promise<MyContext> => {
        return {
            event,
        };
    },
});

export default handler;
