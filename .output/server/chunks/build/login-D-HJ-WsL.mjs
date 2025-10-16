import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports, a as useNuxtApp, n as navigateTo } from './server.mjs';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { u as useFetch, a as useRequestEvent } from './fetch-7W5VOGai.mjs';
import { d as destr, D as klona, E as parse, F as getRequestHeader, G as isEqual, f as setCookie, g as getCookie, H as deleteCookie } from '../_/nitro.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue';
import 'node:stream';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'mongoose';
import 'node:url';

const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = vueExports.ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const formRef = vueExports.ref();
    const usernameCookie = useCookie("login_username");
    const form = vueExports.reactive({
      username: usernameCookie.value || "",
      password: "",
      remember: !!usernameCookie.value
    });
    const rules = {
      username: [{ required: true, message: "请输入账号", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }]
    };
    const loading = vueExports.ref(false);
    const showPassword = vueExports.ref(false);
    const submit = () => {
      formRef.value?.validate(async (valid) => {
        if (!valid) return;
        loading.value = true;
        try {
          const { error } = await useFetch("/api/auth/login", {
            method: "POST",
            server: false,
            body: { username: form.username, password: form.password }
          }, "$1eMTWX2UtQ");
          if (error.value) throw error.value;
          if (form.remember) {
            usernameCookie.value = form.username;
          } else {
            usernameCookie.value = null;
          }
          ElMessage.success("登录成功");
          navigateTo("/home");
        } catch (e) {
          try {
            ElMessage.closeAll();
          } catch {
          }
          ElMessage.error({
            message: "登录失败：账号或密码错误",
            duration: 2e3,
            showClose: true
          });
        } finally {
          loading.value = false;
        }
      });
    };
    const onForgot = () => {
      ElMessage.info("忘记密码：请联系管理员或走找回流程");
    };
    const onRegister = () => {
      navigateTo("/register");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_card = vueExports.resolveComponent("el-card");
      const _component_el_form = vueExports.resolveComponent("el-form");
      const _component_el_form_item = vueExports.resolveComponent("el-form-item");
      const _component_el_input = vueExports.resolveComponent("el-input");
      const _component_el_button = vueExports.resolveComponent("el-button");
      const _component_el_checkbox = vueExports.resolveComponent("el-checkbox");
      const _component_el_divider = vueExports.resolveComponent("el-divider");
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "login-container" }, _attrs))} data-v-e6c87467><div class="login-panel" data-v-e6c87467><div class="panel-left" data-v-e6c87467><div class="brand" data-v-e6c87467><div class="brand-logo" data-v-e6c87467>Nuxt</div><div class="brand-title" data-v-e6c87467>企业后台管理系统</div><div class="brand-desc" data-v-e6c87467>基于 Nuxt + Element Plus，提供高效的中后台体验</div></div></div><div class="panel-right" data-v-e6c87467>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_card, {
        class: "login-card",
        shadow: "never"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-header" data-v-e6c87467${_scopeId}><div class="logo" data-v-e6c87467${_scopeId}>EP</div><div class="title" data-v-e6c87467${_scopeId}><h2 data-v-e6c87467${_scopeId}>欢迎登录</h2><p data-v-e6c87467${_scopeId}>请输入您的账号和密码</p></div></div>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_form, {
              ref_key: "formRef",
              ref: formRef,
              model: form,
              rules,
              "label-position": "top"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_form_item, {
                    label: "账号",
                    prop: "username"
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_input, {
                          modelValue: form.username,
                          "onUpdate:modelValue": ($event) => form.username = $event,
                          placeholder: "请输入账号",
                          "prefix-icon": vueExports.unref(User),
                          clearable: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_el_input, {
                            modelValue: form.username,
                            "onUpdate:modelValue": ($event) => form.username = $event,
                            placeholder: "请输入账号",
                            "prefix-icon": vueExports.unref(User),
                            clearable: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_form_item, {
                    label: "密码",
                    prop: "password"
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_input, {
                          modelValue: form.password,
                          "onUpdate:modelValue": ($event) => form.password = $event,
                          type: showPassword.value ? "text" : "password",
                          placeholder: "请输入密码",
                          "prefix-icon": vueExports.unref(Lock),
                          clearable: ""
                        }, {
                          suffix: vueExports.withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_button, {
                                link: "",
                                type: "primary",
                                onClick: ($event) => showPassword.value = !showPassword.value
                              }, {
                                default: vueExports.withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${serverRenderer_cjs_prodExports.ssrInterpolate(showPassword.value ? "隐藏" : "显示")}`);
                                  } else {
                                    return [
                                      vueExports.createTextVNode(vueExports.toDisplayString(showPassword.value ? "隐藏" : "显示"), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                vueExports.createVNode(_component_el_button, {
                                  link: "",
                                  type: "primary",
                                  onClick: ($event) => showPassword.value = !showPassword.value
                                }, {
                                  default: vueExports.withCtx(() => [
                                    vueExports.createTextVNode(vueExports.toDisplayString(showPassword.value ? "隐藏" : "显示"), 1)
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_el_input, {
                            modelValue: form.password,
                            "onUpdate:modelValue": ($event) => form.password = $event,
                            type: showPassword.value ? "text" : "password",
                            placeholder: "请输入密码",
                            "prefix-icon": vueExports.unref(Lock),
                            clearable: ""
                          }, {
                            suffix: vueExports.withCtx(() => [
                              vueExports.createVNode(_component_el_button, {
                                link: "",
                                type: "primary",
                                onClick: ($event) => showPassword.value = !showPassword.value
                              }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.createTextVNode(vueExports.toDisplayString(showPassword.value ? "隐藏" : "显示"), 1)
                                ]),
                                _: 1
                              }, 8, ["onClick"])
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue", "type", "prefix-icon"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="form-extras" data-v-e6c87467${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_checkbox, {
                    modelValue: form.remember,
                    "onUpdate:modelValue": ($event) => form.remember = $event
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`记住我`);
                      } else {
                        return [
                          vueExports.createTextVNode("记住我")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="links" data-v-e6c87467${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_button, {
                    link: "",
                    type: "primary",
                    onClick: onForgot
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`忘记密码`);
                      } else {
                        return [
                          vueExports.createTextVNode("忘记密码")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_divider, { direction: "vertical" }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_button, {
                    link: "",
                    type: "primary",
                    onClick: onRegister
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`注册账号`);
                      } else {
                        return [
                          vueExports.createTextVNode("注册账号")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_button, {
                    class: "submit-btn",
                    type: "primary",
                    size: "large",
                    loading: loading.value,
                    onClick: submit,
                    block: ""
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` 登录 `);
                      } else {
                        return [
                          vueExports.createTextVNode(" 登录 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_el_form_item, {
                      label: "账号",
                      prop: "username"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_el_input, {
                          modelValue: form.username,
                          "onUpdate:modelValue": ($event) => form.username = $event,
                          placeholder: "请输入账号",
                          "prefix-icon": vueExports.unref(User),
                          clearable: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_el_form_item, {
                      label: "密码",
                      prop: "password"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_el_input, {
                          modelValue: form.password,
                          "onUpdate:modelValue": ($event) => form.password = $event,
                          type: showPassword.value ? "text" : "password",
                          placeholder: "请输入密码",
                          "prefix-icon": vueExports.unref(Lock),
                          clearable: ""
                        }, {
                          suffix: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_el_button, {
                              link: "",
                              type: "primary",
                              onClick: ($event) => showPassword.value = !showPassword.value
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createTextVNode(vueExports.toDisplayString(showPassword.value ? "隐藏" : "显示"), 1)
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue", "type", "prefix-icon"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode("div", { class: "form-extras" }, [
                      vueExports.createVNode(_component_el_checkbox, {
                        modelValue: form.remember,
                        "onUpdate:modelValue": ($event) => form.remember = $event
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode("记住我")
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue"]),
                      vueExports.createVNode("div", { class: "links" }, [
                        vueExports.createVNode(_component_el_button, {
                          link: "",
                          type: "primary",
                          onClick: onForgot
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode("忘记密码")
                          ]),
                          _: 1
                        }),
                        vueExports.createVNode(_component_el_divider, { direction: "vertical" }),
                        vueExports.createVNode(_component_el_button, {
                          link: "",
                          type: "primary",
                          onClick: onRegister
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode("注册账号")
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    vueExports.createVNode(_component_el_button, {
                      class: "submit-btn",
                      type: "primary",
                      size: "large",
                      loading: loading.value,
                      onClick: submit,
                      block: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" 登录 ")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode("div", { class: "card-header" }, [
                vueExports.createVNode("div", { class: "logo" }, "EP"),
                vueExports.createVNode("div", { class: "title" }, [
                  vueExports.createVNode("h2", null, "欢迎登录"),
                  vueExports.createVNode("p", null, "请输入您的账号和密码")
                ])
              ]),
              vueExports.createVNode(_component_el_form, {
                ref_key: "formRef",
                ref: formRef,
                model: form,
                rules,
                "label-position": "top"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_el_form_item, {
                    label: "账号",
                    prop: "username"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_el_input, {
                        modelValue: form.username,
                        "onUpdate:modelValue": ($event) => form.username = $event,
                        placeholder: "请输入账号",
                        "prefix-icon": vueExports.unref(User),
                        clearable: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_el_form_item, {
                    label: "密码",
                    prop: "password"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_el_input, {
                        modelValue: form.password,
                        "onUpdate:modelValue": ($event) => form.password = $event,
                        type: showPassword.value ? "text" : "password",
                        placeholder: "请输入密码",
                        "prefix-icon": vueExports.unref(Lock),
                        clearable: ""
                      }, {
                        suffix: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_el_button, {
                            link: "",
                            type: "primary",
                            onClick: ($event) => showPassword.value = !showPassword.value
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(showPassword.value ? "隐藏" : "显示"), 1)
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue", "type", "prefix-icon"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode("div", { class: "form-extras" }, [
                    vueExports.createVNode(_component_el_checkbox, {
                      modelValue: form.remember,
                      "onUpdate:modelValue": ($event) => form.remember = $event
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode("记住我")
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue"]),
                    vueExports.createVNode("div", { class: "links" }, [
                      vueExports.createVNode(_component_el_button, {
                        link: "",
                        type: "primary",
                        onClick: onForgot
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode("忘记密码")
                        ]),
                        _: 1
                      }),
                      vueExports.createVNode(_component_el_divider, { direction: "vertical" }),
                      vueExports.createVNode(_component_el_button, {
                        link: "",
                        type: "primary",
                        onClick: onRegister
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode("注册账号")
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  vueExports.createVNode(_component_el_button, {
                    class: "submit-btn",
                    type: "primary",
                    size: "large",
                    loading: loading.value,
                    onClick: submit,
                    block: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" 登录 ")
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ]),
                _: 1
              }, 8, ["model"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e6c87467"]]);

export { login as default };
//# sourceMappingURL=login-D-HJ-WsL.mjs.map
