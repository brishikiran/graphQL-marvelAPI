import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';
import redis from 'redis';

const client = redis.createClient();
client.connect().then(() => {
  console.log('Redis Connected');
});

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`GraphQL Server ready at: ${url}`);
