import express from "express"
import { expressMiddleware } from "@apollo/server/express4"
import bodyParser from "body-parser"
import createApolloServer from "./graphQL/index.js"
import UserService from "./services/user.js"

const app = express()
const port = 3000

async function init() {
  app.use(
    "/graphql",
    bodyParser.json(),
    expressMiddleware(await createApolloServer(), {
      context: async ({ req, res }) => {
        const token = req.headers["token"]
        try {
          const user = UserService.decodeJWTToken(token)
          return { user }
        } catch (error) {
          return {}
        }
      },
    })
  )

  app.listen(port, () => {
    console.log(`server listining to port ${port} http://localhost:${port}`)
  })
}

init()
