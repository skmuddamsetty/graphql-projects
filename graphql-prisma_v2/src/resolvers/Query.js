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
    return prisma.query.users(null, info);
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
    return prisma.query.posts(null, info);
    // using real time data from database end
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
};

export { Query as default };
