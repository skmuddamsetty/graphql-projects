import { GraphQLServer } from 'graphql-yoga';

// Demo Users data
const users = [
  {
    id: '1',
    name: 'Santhosh',
    email: 'santhosh@example.com',
    age: 30,
  },
  {
    id: '2',
    name: 'Sunitha',
    email: 'sunitha@example.com',
    age: 28,
  },
  {
    id: '3',
    name: 'Lakhi',
    email: 'lakhi@example.com',
    age: 2,
  },
];

const posts = [
  {
    id: '1',
    title: 'First Post',
    body: 'First Post Body',
    published: true,
  },
  {
    id: '2',
    title: 'Second Post',
    body: 'Second Post Body',
    published: true,
  },
  {
    id: '3',
    title: 'Third Post',
    body: 'Third Post Body',
    published: false,
  },
  {
    id: '4',
    title: 'Fourth Post',
    body: 'Fourth Post Body',
    published: false,
  },
];
// String, Boolean, Int, Float, ID --> 5 Scalar Types i.e. stores a single value
// Type Definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
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
    users(parent, { query = '' }, ctx, info) {
      if (query.length === 0) {
        return users;
      }
      return users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    posts(parent, { query = '' }, ctx, info) {
      if (query.length === 0) {
        return posts;
      }
      return posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
      );
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('GraphQL server is up');
});
