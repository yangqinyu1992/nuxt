import { c as defineEventHandler, r as readBody, e as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'mongoose';
import 'node:url';

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body || {};
  if (username === "admin" && password === "123456") {
    return {
      token: "mock-token",
      user: { name: "Admin", roles: ["admin"] }
    };
  }
  throw createError({
    statusCode: 401,
    statusMessage: "Invalid credentials"
  });
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
