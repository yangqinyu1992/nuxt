import mongoose from 'mongoose'
import type { Model, Document } from 'mongoose'
const { Schema, model, models } = mongoose

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: '', trim: true },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: () => new Date() }
})

export interface UserDoc extends Document {
  _id: string
  username: string
  passwordHash: string
  name?: string
  avatar?: string
  createdAt: Date
}

export const User: Model<UserDoc> = (models.User as Model<UserDoc>) || model<UserDoc>('User', UserSchema)