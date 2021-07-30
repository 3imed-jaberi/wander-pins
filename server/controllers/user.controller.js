import { OAuth2Client } from 'google-auth-library'

import User from '../models/user.model.js'

// create a client instance oauth2
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)

/**
 * verify oauth2 token
 * 
 * @param {string} token 
 * @api private
 */
async function verifyAuthToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID
    })

    return ticket.getPayload()
  } catch (err) {
    console.error("verify token error ", err)
  }
}

/**
 * find or create user
 * 
 * @param {string} token 
 * @api public
 */
export async function findOrCreateUser(token) {
  // verify auth token 
  const googleUser = await verifyAuthToken(token)
  // check if the user eists 
  const user = await User.findOne({ email: googleUser.email })
  // if user exists return them; otherwise, create a new user in db 
  return user ?? new User(googleUser).save()
}
