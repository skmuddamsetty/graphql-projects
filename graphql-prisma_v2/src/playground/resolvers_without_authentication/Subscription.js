const Subscription = {
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      // flow of data
      // Prisma --> Node --> Client (GraphQL playground)
      return prisma.subscription.comment(
        { where: { node: { post: { id: postId } } } },
        info
      );
      /****Commenting old code */
      //   const post = db.posts.find(
      //     (currPost) => currPost.id === postId && currPost.published
      //   );
      //   if (!post) {
      //     throw new Error('Post does not exist');
      //   }
      //   return pubsub.asyncIterator(`comment ${postId}`);
      // },
      /****Commenting old code */
    },
  },
  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.post({ where: { node: { published: true } } });
      // return pubsub.asyncIterator('post');
    },
  },
};

export { Subscription as default };
