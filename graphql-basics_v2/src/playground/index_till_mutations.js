import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
// Demo Users data
// Demo user data
let users = [
  {
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
  },
];

let posts = [
  {
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '1',
  },
  {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '1',
  },
  {
    id: '12',
    title: 'Programming Music',
    body: '',
    published: true,
    author: '2',
  },
];

let comments = [
  {
    id: '102',
    text: 'This worked well for me. Thanks!',
    author: '3',
    post: '10',
  },
  {
    id: '103',
    text: 'Glad you enjoyed it.',
    author: '1',
    post: '10',
  },
  {
    id: '104',
    text: 'This did no work.',
    author: '2',
    post: '11',
  },
  {
    id: '105',
    text: 'Nevermind. I got it to work.',
    author: '1',
    post: '12',
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
    createUser(data: CreateUserInput!): User!,
    deleteUser(id: ID!): User!,
    createPost(data: CreatePostInput!): Post!,
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput!): Comment!,
    deleteComment(id: ID!): Comment!
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

  input CreateUserInput {
    name: String!,
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!,
    body: String!,
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!,
    author: ID!,
    post: ID!
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
    createUser(parent, { data }, ctx, info) {
      // array.some is going to return true if the condition is satsified by any item in the users array
      const { email } = data;
      const emailTaken = users.some((currUser) => currUser.email === email);
      if (emailTaken) {
        throw new Error('Email Taken!');
      }
      const user = { id: uuidv4(), ...data };
      users.push(user);
      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }

        return !match;
      });
      comments = comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, { data }, ctx, info) {
      const { author } = data;
      const userExists = users.some((currUser) => currUser.id === author);
      if (!userExists) {
        throw new Error('User does not exist!');
      }
      const post = {
        id: uuidv4(),
        ...data,
      };
      posts.push(post);
      return post;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      const deletedPosts = posts.splice(postIndex, 1);

      comments = comments.filter((comment) => comment.post !== args.id);

      return deletedPosts[0];
    },
    createComment(parent, { data }, ctx, info) {
      const { author, post } = data;
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
        ...data,
      };
      comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }

      const deletedComments = comments.splice(commentIndex, 1);

      return deletedComments[0];
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
