import { findOrCreateUser } from '../controllers/user.controller.js'

async function context({ req }) {
  let authToken = null
  let currentUser = null

  try {
    // extract the token from authentication header
    authToken = req?.headers?.authorization
    // inject an user as current user
    if (authToken) currentUser = await findOrCreateUser(authToken)
  } catch (err) {
    console.error(`unable to authenticate user with token ${authToken} ..`, err)
  }

  // returned value from the context
  return { currentUser }
}

export default context
