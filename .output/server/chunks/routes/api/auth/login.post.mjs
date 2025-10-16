import { c as defineEventHandler, u as useRuntimeConfig, r as readBody, e as createError, f as setCookie } from '../../../_/nitro.mjs';
import { U as User, v as verifyPassword, s as signToken } from '../../../_/auth.mjs';
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

const login_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const { username, password } = body || {};
  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: "\u7528\u6237\u540D\u548C\u5BC6\u7801\u5FC5\u586B" });
  }
  const user = await User.findOne({ username });
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "\u8D26\u53F7\u6216\u5BC6\u7801\u9519\u8BEF" });
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: "\u8D26\u53F7\u6216\u5BC6\u7801\u9519\u8BEF" });
  }
  const token = signToken({ uid: user._id, username }, config.jwtSecret);
  setCookie(event, "token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 3600
  });
  return { user: { id: user._id, username: user.username } };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
