import { GraphQLServer } from 'graphql-yoga';
// Type Definitions (schema)
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;
// Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'This is my first query';
    },
    name() {
      return 'John Doe';
    },
    location() {
      return 'New York!';
    },
    bio() {
      return 'This is my bio.';
    },
  },
};
const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('GraphQL server is up');
});
