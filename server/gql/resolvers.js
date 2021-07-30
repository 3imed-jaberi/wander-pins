import { AuthenticationError } from 'apollo-server'

import Pin from '../models/pin.model.js'
import { PIN_ADDED, PIN_DELETED, PIN_UPDATED } from './channels.constants.js'
import pubsub from './pubsub.js'

/**
 * helper function provide a quick way to check authenticaton in gql server
 *
 * @api private
 */
function withAuth(next) {
  return (root, args, ctx, info) => {
    // check that we have a valid user passed inside the ctx
    if (!ctx.currentUser) throw new AuthenticationError('You must be logged in !')
    // otherwise, exist a valid user so pass to next resolver
    return next(root, args, ctx, info)
  }
}

// resolvers
const resolvers = {
  Query: {
    me: withAuth((root, args, ctx) => ctx.currentUser),
    async getPins() {
      const pins = await Pin.find().populate('author').populate('comments.author')
      return pins
    }
  },
  Mutation: {
    createPin: withAuth(async (root, args, ctx) => {
      // create a new pin
      const newPin = await new Pin({ ...args.input, author: ctx.currentUser._id }).save()

      // relation between Pin and Author
      const pinAdded = await Pin.populate(newPin, 'author')

      // publish the added pin to the related channel
      pubsub.publish(PIN_ADDED, { pinAdded })

      return pinAdded
    }),
    deletePin: withAuth(async (root, args, ctx) => {
      // find if exist the pin then delete it
      const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinId }).exec()

      // publish the deleted pin to the related channel
      pubsub.publish(PIN_DELETED, { pinDeleted })

      return pinDeleted
    }),
    createComment: withAuth(async (root, args, ctx) => {
      // prepare the new comment
      const newComment = { text: args.text, author: ctx.currentUser._id }

      // find the pin then add the comment to the related pin
      const pinUpdated = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } },
        { new: true }
      ).populate('author').populate('comments.author')

      // publish the new comment to the related channel
      pubsub.publish(PIN_UPDATED, { pinUpdated })

      return pinUpdated
    })
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator(PIN_ADDED)
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED)
    },
    pinUpdated: {
      subscribe: () => pubsub.asyncIterator(PIN_UPDATED)
    }
  }
}

export default resolvers
