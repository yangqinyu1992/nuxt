import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Schema, model, models } = mongoose;
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: () => /* @__PURE__ */ new Date() }
});
const User = models.User || model("User", UserSchema);

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
function signToken(payload, secret, expiresIn = "7d") {
  return jwt.sign(payload, secret, { expiresIn });
}
function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

export { User as U, verifyToken as a, hashPassword as h, signToken as s, verifyPassword as v };
//# sourceMappingURL=auth.mjs.map
