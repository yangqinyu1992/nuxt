import { c as defineEventHandler, u as useRuntimeConfig, r as readBody, e as createError, f as setCookie } from '../../../_/nitro.mjs';
import { U as User, h as hashPassword, s as signToken } from '../../../_/auth.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'mongoose';
import 'node:url';
import 'bcryptjs';
import 'jsonwebtoken';

const register_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const { username, password } = body || {};
  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: "\u7528\u6237\u540D\u548C\u5BC6\u7801\u5FC5\u586B" });
  }
  const exists = await User.findOne({ username });
  if (exists) {
    throw createError({ statusCode: 409, statusMessage: "\u7528\u6237\u540D\u5DF2\u5B58\u5728" });
  }
  const passwordHash = await hashPassword(password);
  const user = await User.create({ username, passwordHash });
  const token = signToken({ uid: user._id, username }, config.jwtSecret);
  setCookie(event, "token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 3600
  });
  return { user: { id: user._id, username: user.username } };
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
