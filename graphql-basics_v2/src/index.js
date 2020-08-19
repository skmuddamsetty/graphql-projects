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
    author: '1',
  },
  {
    id: '2',
    title: 'Second Post',
    body: 'Second Post Body',
    published: true,
    author: '2',
  },
  {
    id: '3',
    title: 'Third Post',
    body: 'Third Post Body',
    published: false,
    author: '1',
  },
  {
    id: '4',
    title: 'Fourth Post',
    body: 'Fourth Post Body',
    published: false,
    author: '3',
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
    age: Int,
    posts: [Post!]!
  }

  type Post {
    id: ID!,
    title: String!,
    body: String!,
    published: Boolean!
    author: User!
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
  // Custom Resolvers
  // Below names should match with the type Property
  // Below "Post" resolver is run for every post being that is being processed
  // and in the type "Post" we have author property
  // to populate that author property we are using custom resolver
  Post: {
    // first argument is "parent" and here "parent" is the current post that is being processed
    author({ author }, args, ctx, info) {
      // here we are using find method in the array specifically
      // because this resolver function should return true
      // or false and find exactly does that
      // it returns true if the user is found and false if not
      return users.find((user) => user.id === author);
    },
  },
  // Below User resolver is going to run for every User found
  // since we have posts property in type "User" to resolve the posts property
  // we are having this custom resolver
  User: {
    // parent here is the user that is being processed
    posts({ id }, args, ctx, info) {
      return posts.filter((post) => post.author === id);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('GraphQL server is up');
});
