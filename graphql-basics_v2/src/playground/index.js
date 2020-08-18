import { GraphQLServer } from 'graphql-yoga';

// String, Boolean, Int, Float, ID --> 5 Scalar Types i.e. stores a single value
// Type Definitions (schema)
const typeDefs = `
  type Query {
    greeting(name: String): String!,
    grades: [Int!]!
    me: User!,
    post: Post!
    add(numbers: [Float!]!): Float!
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

    grades(parent, args, ctx, info) {
      return [99, 75, 93];
    },
    add(parent, { numbers = [] }, ctx, info) {
      if (numbers.length === 0) {
        return 0;
      }
      return numbers.reduce((prevValue, currValue) => {
        return prevValue + currValue;
      });
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('GraphQL server is up');
});
