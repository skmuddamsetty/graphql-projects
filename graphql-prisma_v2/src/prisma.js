import { Prisma } from 'prisma-binding';
const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
});
// prisma bindings
// queries examples
// prisma.query.users(null, '{id name email posts { id, title }}').then((data) => {
//   console.log(JSON.stringify(data, null, 2));
// });

// prisma.query.comments(null, '{id text author { id, name }}').then((data) => {
//   console.log(JSON.stringify(data, null, 2));
// });

// mutations examples
// createPost mutation
// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: 'My second graphql post is live',
//         body: 'This is body',
//         published: true,
//         author: { connect: { id: 'cke484ne8005w0970241n2ah1' } },
//       },
//     },
//     '{ id, title, body, published, author {id, name, email}}'
//   )
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2));
//     return prisma.query.users(null, '{id name email posts { id, title }}');
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2));
//   });

// updatePost mutation
// prisma.mutation
//   .updatePost(
//     {
//       data: { published: true },
//       where: { id: 'cke48k2yb00900970x8vbbwig' },
//     },
//     '{id, title, body, published, author{ id, name,email}}'
//   )
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2));
//   });

// async/await

const createPostForUser = async (authorId, data) => {
  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: { connect: { id: authorId } },
      },
    },
    '{ id, title, body, published, author {id, name, email}}'
  );
  const user = await prisma.query.user(
    { where: { id: authorId } },
    '{id, name, email posts {id, title, published}}'
  );
  return user;
};

// createPostForUser('cke4848pj005i09706w86m782', {
//   title: 'post using async/await',
//   body: 'this is bodyyy',
//   published: true,
// }).then((user) => {
//   console.log(JSON.stringify(user, null, 2));
// });
