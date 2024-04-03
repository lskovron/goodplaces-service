import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { config } from "dotenv";
import { resolvers } from "../graphql/resolvers.js";
import typeDefs from "../graphql/schema.js";
import { startMongo } from "../mongo/mongo.js";

console.log('hello')

config({path: '.env'})
const { MONGO_URI } = process.env;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await startMongo(MONGO_URI);

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
