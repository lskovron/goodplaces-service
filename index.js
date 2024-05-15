import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { resolvers } from './src/graphql/resolvers.js';
import typeDefs from './src/graphql/schema.js';
import { startMongo } from './src/mongo/mongo.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startMongo();

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
