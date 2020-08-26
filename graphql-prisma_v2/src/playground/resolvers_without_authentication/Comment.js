// Below Comment resolver is going to run for every Comment found
// since we have author property in type "Comment" to resolve the author property
// we are having this custom resolver
const Comment = {
  // // commented the below part because this overrides the default behavior of prisma while populating the relationship data
  // // parent here is the Comment that is being processed
  // // looping through the users array to find the person who created the comment
  // // destructured property from first argument i.e. parent comes from the Comment that
  // // is being processed
  // author({ author }, args, { db }, info) {
  //   console.log(db);
  //   return db.users.find((user) => user.id === author);
  // },
  // post({ post }, args, { db }, info) {
  //   return db.posts.find((currentPost) => currentPost.id === post);
  // },
};

export { Comment as default };
