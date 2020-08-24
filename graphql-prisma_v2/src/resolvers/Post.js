// Custom Resolvers
// Below names should match with the type Property
// Below "Post" resolver is run for every post being that is being processed
// and in the type "Post" we have author property
// to populate that author property we are using custom resolver
const Post = {
  // // commented the below part because this overrides the default behavior of prisma while populating the relationship data
  // // first argument is "parent" and here "parent" is the current post that is being processed
  // author({ author }, args, { db }, info) {
  //   // here we are using find method in the array specifically
  //   // because this resolver function should return true
  //   // or false and find exactly does that
  //   // it returns true if the user is found and false if not
  //   return db.users.find((user) => user.id === author);
  // },
  // comments({ id }, args, { db }, info) {
  //   return db.comments.filter((comment) => comment.post === id);
  // },
};
export { Post as default };
