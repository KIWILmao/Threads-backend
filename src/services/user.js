import { createHmac, randomBytes } from "node:crypto"
import JWT from "jsonwebtoken"
import { prismaClient } from "../lib/db.js"

const JWT_SECRET = "W$HUBHAM"

export default class UserService {
  // genrate hash value
  static generateHash(salt, password) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex")

    return hashedPassword
  }

  //get user detail by email
  static getUserByEmail(email) {
    const user = prismaClient.user.findUnique({ where: { email } })
    return user
  }

  //generate token using jwt
  static async getUserToken(payload) {
    const { email, password } = payload
    const user = await this.getUserByEmail(email)

    if (!user) {
      throw new Error("no user found with that email")
    }

    const userSalt = user.salt
    const userHashPassword = this.generateHash(userSalt, password)

    if (userHashPassword != user.password) {
      throw new Error("incorrect password")
    }

    //JWT token
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET)

    return token
  }

  //create user basically signup
  static createUser(payload) {
    const { firstName, lastName, email, password } = payload

    const salt = randomBytes(32).toString("hex")
    const hashedPassword = this.generateHash(salt, password)

    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      },
    })
  }

  static decodeJWTToken(token){
    return JWT.verify(token, JWT_SECRET)
  }

}
