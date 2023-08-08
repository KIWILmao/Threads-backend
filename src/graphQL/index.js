import { ApolloServer } from "@apollo/server"
import { User } from "./user/index.js"

async function createApolloServer() {
  const server = new ApolloServer({
    typeDefs: `
            ${User.typeDefs}
            type Query {
                ${User.queries}
            }
            type Mutation {
                ${User.mutations} 
            }
        `,
    resolvers: {
      Query: {
        ...User.resolvers.query,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  })

  await server.start()

  return server
}

export default createApolloServer
