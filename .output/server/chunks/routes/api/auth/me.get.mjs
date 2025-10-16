import { c as defineEventHandler, u as useRuntimeConfig, g as getCookie, e as createError } from '../../../_/nitro.mjs';
import { a as verifyToken, U as User } from '../../../_/auth.mjs';
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

const me_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const token = getCookie(event, "token");
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "\u672A\u767B\u5F55" });
  }
  try {
    const decoded = verifyToken(token, config.jwtSecret);
    const user = await User.findById(decoded.uid);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "\u7528\u6237\u4E0D\u5B58\u5728" });
    }
    return { user: { id: user._id, username: user.username } };
  } catch {
    throw createError({ statusCode: 401, statusMessage: "\u65E0\u6548\u4EE4\u724C" });
  }
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
