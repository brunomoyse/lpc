import { schema } from '#graphql/schema'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateH3Handler } from '@as-integrations/h3'
import { resolvers } from '../graphql/resolvers'

const apollo = new ApolloServer({
    typeDefs: schema,
    resolvers,
})

export default startServerAndCreateH3Handler(apollo)
