import { GraphQLServer } from 'graphql-yoga';
// String, Boolean, Int, Float, ID --> 5 Scalar Types i.e. stores a single value
// Type Definitions (schema)
const typeDefs = `
  type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
  }
`;
// Resolvers
const resolvers = {
  Query: {
    id() {
      return 'abc123';
    },
    name() {
      return 'John Doe';
    },
    age() {
      return 29;
    },
    employed() {
      return true;
    },
    gpa() {
      return null;
    },
  },
};
const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('GraphQL server is up');
});
