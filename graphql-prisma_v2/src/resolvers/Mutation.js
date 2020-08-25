const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    const { email } = data;
    const emailTaken = await prisma.exists.User({ email: email });
    if (emailTaken) {
      throw new Error('Email Taken!');
    }
    // returning promise
    return await prisma.mutation.createUser({ data }, info);
    /*********Commenting old code which refers to static data start */
    // // array.some is going to return true if the condition is satsified by any item in the users array
    // const { email } = data;
    // const emailTaken = db.users.some((currUser) => currUser.email === email);
    // if (emailTaken) {
    //   throw new Error('Email Taken!');
    // }
    // const user = { id: uuidv4(), ...data };
    // db.users.push(user);
    // return user;
    /*********Commenting old code which refers to static data end */
  },
  async deleteUser(parent, args, { prisma }, info) {
    const user = await prisma.exists.User({ id: args.id });
    if (!user) {
      throw new Error('User not found!');
    }
    return await prisma.mutation.deleteUser({ where: { id: args.id } }, info);
    /*********Commenting old code which refers to static data start */
    // const userIndex = db.users.findIndex((user) => user.id === args.id);
    // if (userIndex === -1) {
    //   throw new Error('User not found');
    // }
    // const deletedUsers = db.users.splice(userIndex, 1);
    // db.posts = db.posts.filter((post) => {
    //   const match = post.author === args.id;
    //   if (match) {
    //     db.comments = db.comments.filter((comment) => comment.post !== post.id);
    //   }
    //   return !match;
    // });
    // db.comments = db.comments.filter((comment) => comment.author !== args.id);
    // return deletedUsers[0];
    /*********Commenting old code which refers to static data end */
  },
  async updateUser(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateUser({ where: { id }, data }, info);
    /*********Commenting old code which refers to static data start */
    // const user = db.users.find((currUser) => currUser.id === id);
    // if (!user) {
    //   throw new Error('User does not exist!');
    // }
    // // checking email
    // if (typeof data.email === 'string') {
    //   const emailTaken = db.users.some(
    //     (currUser) => currUser.email === data.email
    //   );
    //   if (emailTaken) {
    //     throw new Error('Email Taken!');
    //   }
    //   user.email = data.email;
    // }
    // if (typeof data.name === 'string') {
    //   user.name = data.name;
    // }
    // if (typeof data.age !== 'undefined') {
    //   user.age = data.age;
    // }
    // return user;
    /*********Commenting old code which refers to static data end */
  },
  async createPost(parent, { data }, { pubsub, prisma }, info) {
    const { title, body, published } = data;
    return prisma.mutation.createPost(
      {
        data: {
          title,
          body,
          published,
          author: {
            connect: {
              id: data.author,
            },
          },
        },
      },
      info
    );
    /*********Commenting old code which refers to static data start */
    // const { author, published } = data;
    // const userExists = db.users.some((currUser) => currUser.id === author);
    // if (!userExists) {
    //   throw new Error('User does not exist!');
    // }
    // const post = {
    //   id: uuidv4(),
    //   ...data,
    // };
    // db.posts.push(post);
    // if (published) {
    //   pubsub.publish('post', {
    //     post: {
    //       mutation: 'CREATED',
    //       data: post,
    //     },
    //   });
    // }
    // return post;
    /*********Commenting old code which refers to static data end */
  },
  async deletePost(parent, args, { db, pubsub, prisma }, info) {
    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
    /*********Commenting old code which refers to static data start */
    // const postIndex = db.posts.findIndex((post) => post.id === args.id);
    // if (postIndex === -1) {
    //   throw new Error('Post not found');
    // }
    // const [deletedPost] = db.posts.splice(postIndex, 1);
    // db.comments = db.comments.filter((comment) => comment.post !== args.id);
    // // publishing only if the post is published
    // if (deletedPost.published) {
    //   pubsub.publish('post', {
    //     post: { mutation: 'DELETED', data: deletedPost },
    //   });
    // }
    // return deletedPost;
    /*********Commenting old code which refers to static data end */
  },
  async updatePost(parent, { id, data }, { pubsub, prisma }, info) {
    return prisma.mutation.updatePost({ where: { id }, data }, info);
    /*********Commenting old code which refers to static data start */
    // verify post exists
    // const post = db.posts.find((currentPost) => currentPost.id === id);
    // const originalPost = { ...post };
    // if (!post) {
    //   throw new Error('Post does not exist');
    // }
    // if (typeof data.title === 'string') {
    //   post.title = data.title;
    // }
    // if (typeof data.body === 'string') {
    //   post.body = data.body;
    // }
    // if (typeof data.published === 'boolean') {
    //   post.published = data.published;
    //   if (originalPost.published && !post.published) {
    //     // deleted
    //     pubsub.publish('post', {
    //       post: {
    //         mutation: 'DELETED',
    //         data: originalPost,
    //       },
    //     });
    //   } else if (!originalPost.published && post.published) {
    //     // created
    //     pubsub.publish('post', { post: { mutation: 'CREATED', data: post } });
    //   }
    // } else if (post.published) {
    //   //updated
    //   pubsub.publish('post', { post: { mutation: 'UPDATED', data: post } });
    // }
    // return post;
    /*********Commenting old code which refers to static data end */
  },
  async createComment(parent, { data }, { prisma }, info) {
    return prisma.mutation.createComment(
      {
        data: {
          text: data.text,
          author: { connect: { id: data.author } },
          post: {
            connect: { id: data.post },
          },
        },
      },
      info
    );
    /*********Commenting old code which refers to static data start */
    // const { author, post } = data;
    // const userExists = db.users.some((currUser) => currUser.id === author);
    // if (!userExists) {
    //   throw new Error('User does not exist!');
    // }
    // const postExists = db.posts.some(
    //   (currPost) => currPost.id === post && currPost.published
    // );
    // if (!postExists) {
    //   throw new Error('Post does not exist');
    // }
    // const comment = {
    //   id: uuidv4(),
    //   ...data,
    // };
    // db.comments.push(comment);
    // pubsub.publish(`comment ${post}`, {
    //   comment: { mutation: 'CREATED', data: comment },
    // });
    // return comment;
    /*********Commenting old code which refers to static data end */
  },
  async deleteComment(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteComment({ where: { id } }, info);
    /*********Commenting old code which refers to static data start */
    // const commentIndex = db.comments.findIndex(
    //   (comment) => comment.id === args.id
    // );
    // if (commentIndex === -1) {
    //   throw new Error('Comment not found');
    // }
    // const deletedComments = db.comments.splice(commentIndex, 1);
    // pubsub.publish(`comment ${deletedComments[0].post}`, {
    //   comment: { mutation: 'DELETED', data: deletedComments[0] },
    // });
    // return deletedComments[0];
    /*********Commenting old code which refers to static data end */
  },
  async updateComment(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateComment({ where: { id }, data }, info);
    /*********Commenting old code which refers to static data start */
    // verify comment exists
    // const comment = db.comments.find((currComment) => currComment.id === id);
    // if (!comment) {
    //   throw new Error('Comment does not exist');
    // }
    // if (typeof data.text === 'string') {
    //   comment.text = data.text;
    //   pubsub.publish(`comment ${comment.post}`, {
    //     comment: { mutation: 'UPDATED', data: comment },
    //   });
    // }
    // return comment;
    /*********Commenting old code which refers to static data end */
  },
};

export { Mutation as default };
