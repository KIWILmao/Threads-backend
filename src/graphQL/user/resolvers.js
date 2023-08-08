import UserService from "../../services/user.js"

const query = {
  getUserToken: async (_, payload) => {
    const token = await UserService.getUserToken(payload)
    return token
  },
  
  getCurrentLoggedInUser: async (_, args, context) => {
    if (context && context.user) {
      const email = context.user.email
      const user = UserService.getUserByEmail(email)
      return user
    }
    throw new Error("IDK")
  },
}

const mutations = {
  createUser: async (_, payload) => {
    const res = await UserService.createUser(payload)
    return res.id
  },
}

export const resolvers = { query, mutations }
