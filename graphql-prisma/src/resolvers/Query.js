const Query = {
  users(parent, args, { db, prisma }, info) {
    return prisma.query.users(null, info);
    /***Static Code Start */
    // if (!args.query) {
    //   return db.users;
    // }

    // return db.users.filter((user) => {
    //   return user.name.toLowerCase().includes(args.query.toLowerCase());
    // });
    /***Static Code End */
  },
  posts(parent, args, { db, prisma }, info) {
    return prisma.query.posts(null, info);
    /***Static Code Start */
    // if (!args.query) {
    //   return db.posts;
    // }

    // return db.posts.filter((post) => {
    //   const isTitleMatch = post.title
    //     .toLowerCase()
    //     .includes(args.query.toLowerCase());
    //   const isBodyMatch = post.body
    //     .toLowerCase()
    //     .includes(args.query.toLowerCase());
    //   return isTitleMatch || isBodyMatch;
    // });
    /***Static Code End */
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  me() {
    return {
      id: '123098',
      name: 'Mike',
      email: 'mike@example.com',
    };
  },
  post() {
    return {
      id: '092',
      title: 'GraphQL 101',
      body: '',
      published: false,
    };
  },
};

export { Query as default };
