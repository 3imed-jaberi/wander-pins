// import modules
import { ApolloServer } from 'apollo-server'

import './dotEnv.js'
import * as db from './models/index.js'
import typeDefs from './gql/typeDefs.js'
import resolvers from './gql/resolvers.js'
import context from './gql/context.js'

// connect to mongodb
await db.connect()

// setup the graphql server 
const server = new ApolloServer({ typeDefs, resolvers, context })

// run the graphql server
server
  .listen({ port: process.env.PORT })
  .then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url} ..`)
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl} ..`);
  })
