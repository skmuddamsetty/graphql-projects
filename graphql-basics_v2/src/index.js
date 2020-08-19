import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
import db from './db';

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
    users(parent, { query = '' }, { db }, info) {
      if (query.length === 0) {
        return db.users;
      }
      return db.users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    posts(parent, { query = '' }, { db }, info) {
      if (query.length === 0) {
        return db.posts;
      }
      return db.posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
      );
    },
    comments(parent, args, { db }, info) {
      return db.comments;
    },
  },
  // Mutations
  Mutation: {
    createUser(parent, { data }, { db }, info) {
      // array.some is going to return true if the condition is satsified by any item in the users array
      const { email } = data;
      const emailTaken = db.users.some((currUser) => currUser.email === email);
      if (emailTaken) {
        throw new Error('Email Taken!');
      }
      const user = { id: uuidv4(), ...data };
      db.users.push(user);
      return user;
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUsers = db.users.splice(userIndex, 1);

      db.posts = db.posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          db.comments = db.comments.filter(
            (comment) => comment.post !== post.id
          );
        }

        return !match;
      });
      db.comments = db.comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, { data }, { db }, info) {
      const { author } = data;
      const userExists = db.users.some((currUser) => currUser.id === author);
      if (!userExists) {
        throw new Error('User does not exist!');
      }
      const post = {
        id: uuidv4(),
        ...data,
      };
      db.posts.push(post);
      return post;
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      const deletedPosts = db.posts.splice(postIndex, 1);

      db.comments = db.comments.filter((comment) => comment.post !== args.id);

      return deletedPosts[0];
    },
    createComment(parent, { data }, { db }, info) {
      const { author, post } = data;
      const userExists = db.users.some((currUser) => currUser.id === author);
      if (!userExists) {
        throw new Error('User does not exist!');
      }
      const postExists = db.posts.some(
        (currPost) => currPost.id === post && currPost.published
      );
      if (!postExists) {
        throw new Error('Post does not exist');
      }
      const comment = {
        id: uuidv4(),
        ...data,
      };
      db.comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }

      const deletedComments = db.comments.splice(commentIndex, 1);

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
    author({ author }, args, { db }, info) {
      // here we are using find method in the array specifically
      // because this resolver function should return true
      // or false and find exactly does that
      // it returns true if the user is found and false if not
      return db.users.find((user) => user.id === author);
    },
    comments({ id }, args, { db }, info) {
      return db.comments.filter((comment) => comment.post === id);
    },
  },
  // Below User resolver is going to run for every User found
  // since we have posts property in type "User" to resolve the posts property
  // we are having this custom resolver
  User: {
    // parent here is the user that is being processed
    posts({ id }, args, { db }, info) {
      return db.posts.filter((post) => post.author === id);
    },
    comments({ id }, args, { db }, info) {
      return db.comments.filter((comment) => comment.author === id);
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
    author({ author }, args, { db }, info) {
      return db.users.find((user) => user.id === author);
    },
    post({ post }, args, ctx, info) {
      return db.posts.find((currentPost) => currentPost.id === post);
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { db },
});
server.start(() => {
  console.log('GraphQL server is up');
});
