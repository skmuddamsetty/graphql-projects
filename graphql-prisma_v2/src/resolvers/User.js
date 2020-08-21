// Below User resolver is going to run for every User found
// since we have posts property in type "User" to resolve the posts property
// we are having this custom resolver
const User = {
  // parent here is the user that is being processed
  posts({ id }, args, { db }, info) {
    return db.posts.filter((post) => post.author === id);
  },
  comments({ id }, args, { db }, info) {
    return db.comments.filter((comment) => comment.author === id);
  },
};

export { User as default };
