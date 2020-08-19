import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
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

const comments = [
  {
    id: '10',
    text: 'I am good',
    author: '1',
    post: '1',
  },
  {
    id: '11',
    text: 'What is this?',
    author: '2',
    post: '1',
  },
  {
    id: '12',
    text: 'GraphQL is awesome',
    author: '1',
    post: '2',
  },
  {
    id: '13',
    text: 'GraphQL is super flexible',
    author: '3',
    post: '3',
  },
];
// String, Boolean, Int, Float, ID --> 5 Scalar Types i.e. stores a single value
// Type Definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!,
    posts(query: String): [Post!]!,
    comments: [Comment!]!
    me: User!,
    post: Post!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!,
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!,
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }

  type User {
    id: ID!,
    name: String!,
    email: String!,
    age: Int,
    posts: [Post!]!,
    comments: [Comment!]!
  }

  type Post {
    id: ID!,
    title: String!,
    body: String!,
    published: Boolean!,
    author: User!,
    comments: [Comment!]!
  }

  type Comment {
    id: ID!,
    text: String!,
    author: User!
    post: Post!
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
    comments(parent, args, ctx, info) {
      return comments;
    },
  },
  // Mutations
  Mutation: {
    createUser(parent, { email, name, age = null }, ctx, info) {
      // array.some is going to return true if the condition is satsified by any item in the users array
      const emailTaken = users.some((currUser) => currUser.email === email);
      if (emailTaken) {
        throw new Error('Email Taken!');
      }
      const user = { id: uuidv4(), name, email, age };
      users.push(user);
      return user;
    },
    createPost(parent, { title, body, published, author }, ctx, info) {
      const userExists = users.some((currUser) => currUser.id === author);
      if (!userExists) {
        throw new Error('User does not exist!');
      }
      const post = {
        id: uuidv4(),
        title,
        body,
        published,
        author,
      };
      posts.push(post);
      return post;
    },
    createComment(parent, { text, author, post }, ctx, info) {
      const userExists = users.some((currUser) => currUser.id === author);
      if (!userExists) {
        throw new Error('User does not exist!');
      }
      const postExists = posts.some(
        (currPost) => currPost.id === post && currPost.published
      );
      if (!postExists) {
        throw new Error('Post does not exist');
      }
      const comment = {
        id: uuidv4(),
        text,
        author,
        post,
      };
      comments.push(comment);
      return comment;
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
    comments({ id }, args, ctx, info) {
      return comments.filter((comment) => comment.post === id);
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
    comments({ id }, args, ctx, info) {
      return comments.filter((comment) => comment.author === id);
    },
  },
  // Below Comment resolver is going to run for every Comment found
  // since we have author property in type "Comment" to resolve the author property
  // we are having this custom resolver
  Comment: {
    // parent here is the Comment that is being processed
    // looping through the users array to find the person who created the comment
    // destructured property from first argument i.e. parent comes from the Comment that
    // is being processed
    author({ author }, args, ctx, info) {
      return users.find((user) => user.id === author);
    },
    post({ post }, args, ctx, info) {
      return posts.find((currentPost) => currentPost.id === post);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('GraphQL server is up');
});
