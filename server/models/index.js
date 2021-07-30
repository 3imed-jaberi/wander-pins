import mongoose from 'mongoose'

/**
 * connect to mongodb server
 */
export async function connect() {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })

  console.log(`MongoDB Connected: ${conn.connection.host}`)
}
