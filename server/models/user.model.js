import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  pictrue: String
})

export default mongoose.model('User', UserSchema)
