import { GraphQLServer } from 'graphql-yoga';
// Type Definitions (schema)
const typeDefs = `
  type Query {
    hello: String!
  }
`;
// Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'This is my first query';
    },
  },
};
const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('GraphQL server is up');
});
