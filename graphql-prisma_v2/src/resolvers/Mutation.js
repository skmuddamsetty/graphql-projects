import brcypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// creating a token
// const token = jwt.sign({ id: 46 }, 'mysecret');
// console.log(token);
// const decoded = jwt.decode(token);
// console.log(decoded);
// const verifiedToken = jwt.verify(token, 'mysecret');
// console.log(verifiedToken);

// const dummy = async () => {
//   const password = 'password123';
//   const hashedPassword =
//     '$2a$10$vF/.fm0zygs/P7I9U993RuPMpr8HE7Rx/r4IT1sHeDu5WAyT4ScOK';
//   const isMatched = await brcypt.compare(password, hashedPassword);
//   console.log(isMatched);
// };
// dummy();

const Mutation = {
  async login(parent, { data }, { prisma }, info) {
    const user = await prisma.query.user({ where: { email: data.email } });
    if (!user) {
      throw new Error('Invalid Credentials!');
    }
    const passwordMatch = await brcypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid Credentials!');
    }
    return {
      user,
      token: jwt.sign({ userId: user.id }, 'thisisasecret'),
    };
  },
  async createUser(parent, { data }, { prisma }, info) {
    const { email, password } = data;
    // validating the password
    if (password.length < 8) {
      throw new Error('Password must be 8 characters or longer!');
    }
    const emailTaken = await prisma.exists.User({ email: email });
    if (emailTaken) {
      throw new Error('Email Taken!');
    }
    // hashing the password
    const hashedPassword = await brcypt.hash(password, 10);

    // returning promise
    const user = await prisma.mutation.createUser({
      data: { ...data, password: hashedPassword },
    });
    return {
      user,
      token: jwt.sign({ userId: user.id }, 'thisisasecret'),
    };
  },
  async deleteUser(parent, args, { prisma }, info) {
    const user = await prisma.exists.User({ id: args.id });
    if (!user) {
      throw new Error('User not found!');
    }
    return await prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },
  async updateUser(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateUser({ where: { id }, data }, info);
  },
  async createPost(parent, { data }, { prisma }, info) {
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
  },
  async deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async updatePost(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updatePost({ where: { id }, data }, info);
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
  },
  async deleteComment(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteComment({ where: { id } }, info);
  },
  async updateComment(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateComment({ where: { id }, data }, info);
  },
};

export { Mutation as default };
