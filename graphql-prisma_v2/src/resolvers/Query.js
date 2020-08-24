const Query = {
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
  users(parent, { query = '' }, { prisma }, info) {
    // // using static data start
    // if (query.length === 0) {
    //   return db.users;
    // }
    // return db.users.filter((user) =>
    //   user.name.toLowerCase().includes(query.toLowerCase())
    // );
    // // using static data end
    // using real time data from database start
    const opArgs = {};
    if (query.length > 0) {
      // example of using name_contains
      // opArgs.where = {
      //   // name_contains came from the prisma docs
      //   name_contains: query,
      // };

      // example of using OR in the query
      opArgs.where = {
        OR: [
          {
            name_contains: query,
          },
          { email_contains: query },
        ],
      };
    }
    return prisma.query.users(opArgs, info);
    // using real time data from database end
  },
  posts(parent, { query = '' }, { prisma }, info) {
    // // using static data start
    // if (query.length === 0) {
    //   return db.posts;
    // }
    // return db.posts.filter(
    //   (post) =>
    //     post.title.toLowerCase().includes(query.toLowerCase()) ||
    //     post.body.toLowerCase().includes(query.toLowerCase())
    // );
    // // using static data end
    // using real time data from database start
    const opArgs = {};
    if (query.length > 0) {
      opArgs.where = {
        OR: [
          {
            title_contains: query,
          },
          { body_contains: query },
        ],
      };
    }
    return prisma.query.posts(opArgs, info);
    // using real time data from database end
  },
  comments(parent, args, { db, prisma }, info) {
    return prisma.query.comments(null, info);
  },
};

export { Query as default };
