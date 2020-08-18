import { GraphQLServer } from 'graphql-yoga';

// String, Boolean, Int, Float, ID --> 5 Scalar Types i.e. stores a single value
// Type Definitions (schema)
const typeDefs = `
  type Query {
    greeting(name: String): String!,
    me: User!,
    post: Post!
  }

  type User {
    id: ID!,
    name: String!,
    email: String!,
    age: Int
  }

  type Post {
    id: ID!,
    title: String!,
    body: String!,
    published: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: 'abc123',
        name: 'Mike Doe',
        email: 'mike@example.com',
        age: 28,
      };
    },
    post() {
      return {
        id: '123abc',
        title: 'First Post',
        body: 'First post body',
        published: true,
      };
    },

    greeting(parent, { name = 'Anonymous' }, ctx, info) {
      return `Hello ${name}`;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('GraphQL server is up');
});
