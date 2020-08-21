# How to initialize a prisma project

sudo prisma init nameOfTheProject
for ex: sudo prisma init products

# to initialize docker

sudo docker-compose up -d

# to deploy prisma changes

prisma deploy

## Queries

# comments

```
query {
  comments {
    id,
    text,
    author{
      id,
      name,
      email
    }
  }
}
```

## Mutations

# createUser

```
mutation{
  createUser(data:{name:"Sunitha", email:"sun@gmail.com"}){
    id,
    name,
    email
  }
}
```

# deleteUser

```
mutation{
  deleteUser(where:{id:"cke47plxe001b0970rl9vgfgk"}){
    id,
    name
  }
}
```

# updateUser

```
mutation{
  updateUser(
    data:{name:"Santhosh Kumar"},
    where:{id:"cke47plxe001b0970rl9vgfgk"}
  ){
    id,
    name
  }
}
```

# createPost

```
mutation{
  createPost(
    data:{
      title:"New Post",
      body:"New post body",
      published: true,
      author:{
        connect:{
          id:"cke4848pj005i09706w86m782"
        }
      }
    }
  ){
    id,
    title,
    body,
    published,
    author{
      id,
      name,
      email
    }
  }
}
```

# updatePost

```
mutation {
  updatePost(data:{published: true}, where:{id:"cke48k2yb00900970x8vbbwig"}){
    id,
    title,
    body,
    published,
    author{
      id,
      name,
      email
    }
  }
}
```

# createComment

```
mutation{
  createComment(
  data:{text:"Random Comment",
  post:{
    connect:{
      id:"cke48k2yb00900970x8vbbwig"
    }
  },
  author:{
    connect: {
      id: "cke484ne8005w0970241n2ah1"
    }
  }},

  ){
    id,
    text,
    author{
      id,
      email,
      name
    },
    post{
      id,
      title,
      body,
      published
    }
  }
}
```
