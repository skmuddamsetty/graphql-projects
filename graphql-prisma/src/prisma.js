import { Prisma } from 'prisma-binding';
const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
});

// prisma.query
//   .users(null, '{id name posts {id, title}}')
//   .then((data) => console.log(JSON.stringify(data, undefined, 2)));

// prisma.query
//   .comments(null, '{id text, author {id, name}}')
//   .then((data) => console.log(JSON.stringify(data, null, 2)));

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: 'GraphQl post 2 from node js',
//         body: '',
//         published: false,
//         author: {
//           connect: {
//             id: 'ckcwtit8n006f0828hp50u8rz',
//           },
//         },
//       },
//     },
//     '{id title body published}'
//   )
//   .then((data) => {
//     console.log(JSON.stringify(data, null, 2));
//     return prisma.query.users(null, '{id name posts {id, title}}');
//   })
//   .then((data) => console.log(JSON.stringify(data, null, 2)));

// update
// prisma.mutation
//   .updatePost(
//     {
//       data: {
//         published: true,
//       },
//       where: {
//         id: 'ckcxaq35p00j008281t88frtj',
//       },
//     },
//     '{id title body published}'
//   )
//   .then((data) => {
//     console.log(data);
//     return prisma.query.posts(null, '{id title body published}');
//   })
//   .then((data) => {
//     console.log('All posts', JSON.stringify(data, null, 2));
//   });

// async / await
// 1. create a new post
// 2. fetch all of the info about the user

const createPostForUser = async (authorId, data) => {
  const userExists = await prisma.exists.User({ id: authorId });
  if (!userExists) {
    throw new Error('User Not Found!');
  }
  const post = await prisma.mutation.createPost(
    {
      data: { ...data, author: { connect: { id: authorId } } },
    },
    '{author {id name email posts {id title published}} }'
  );
  // const user = prisma.query.user(
  //   { where: { id: authorId } },
  //   '{id, name, email, posts {id, title, published}}'
  // );
  return post.author;
};

const updatePostForUser = async (postId, data) => {
  const postExists = await prisma.exists.Post({ id: postId });
  if (!postExists) {
    throw new Error('Post Not Found!');
  }
  const updatedPost = await prisma.mutation.updatePost(
    {
      where: {
        id: postId,
      },
      data,
    },
    '{author {id name email posts {id, title, published}}}'
  );
  // const user = prisma.query.user(
  //   {
  //     where: {
  //       id: updatedPost.author.id,
  //     },
  //   },
  //   '{id name email posts {id, title published}}'
  // );

  return updatedPost.author;
};

// exists demo
// prisma.exists
//   .Comment({
//     id: 'ckcwu9rjp00ek0828qtq3nxhh',
//     author: {
//       id: 'ckcwtit8n006f0828hp50u8rz',
//     },
//   })
//   .then((res) => console.log(res));

// createPostForUser('ckcwtit8n006f0828hp50u8rz', {
//   title: 'This is post for sunitha from async await',
//   body: 'This is body',
//   published: true,
// })
//   .then((data) => console.log(JSON.stringify(data, null, 2)))
//   .catch((err) => console.log(err.message));

// updatePostForUser('ckcwtzh9h00a80828nw0jg85d', {
//   title: 'this is my updated title from async awaits',
// })
//   .then((data) => console.log(JSON.stringify(data, null, 2)))
//   .catch((error) => console.log(error.message));
