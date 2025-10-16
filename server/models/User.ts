import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() }
})

export type UserDoc = {
  _id: string
  username: string
  passwordHash: string
  createdAt: Date
}

export const User = models.User || model<UserDoc>('User', UserSchema)