# How to initialize a prisma project

sudo prisma init nameOfTheProject
for ex: sudo prisma init products

# to initialize docker

sudo docker-compose up -d

# to deploy prisma changes

prisma deploy

# .graphqlconfig

```
// using schemaPath we are telling the cli where it should place the generated schema file
// here we are telling that to place the generated schema file into generated folder with name prisma.graphql
// endPoints specify to which url it should connect to while generating the schema
{
  "projects": {
    "prisma": {
      "schemaPath": "src/generated/prisma.graphql",
      "extensions": {
        "endpoints": {
          "default": "http://localhost:4466"
        }
      }
    }
  }
}

```

# package.json schema generation command

Here we are telling cli to run get-schema command and to use the project with name "prisma"
When we run this command it is going to use datamodel.graphql inside this prisma folder to generate the schema

```
"get-schema": "graphql get-schema -p prisma"
```

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

# read later

prisma-bindings

# creating new prisma project

1. duplicate the prisma folder with a different name for ex: prisma-review-website

2. delete docker-compose.yml as a file was already present in the prisma folder

3. in prisma.yml in new folder change the endpoint url: http://localhost:4466/reviews/default
4. reviews in the url is service name (project name)
5. default in the url is stage name(can be anything, if you did not pick anything, it will be default)
6. go to prisma-review-website folder and run prisma deploy to deploy the new project
7. visit localhost:4466/reviews/default
