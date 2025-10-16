import { i as defineNuxtRouteMiddleware } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'mongoose';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue';
import 'element-plus';
import '@element-plus/icons-vue';
import 'node:stream';

const auth_global_client = defineNuxtRouteMiddleware(async (to) => {
  return;
});

export { auth_global_client as default };
//# sourceMappingURL=auth.global.client-BhE3-slE.mjs.map
