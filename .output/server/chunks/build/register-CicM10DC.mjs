import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports, n as navigateTo } from './server.mjs';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { u as useFetch } from './fetch-7W5VOGai.mjs';
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
import 'node:stream';

const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    const formRef = vueExports.ref();
    const form = vueExports.reactive({
      username: "",
      password: "",
      confirm: ""
    });
    const rules = {
      username: [{ required: true, message: "请输入账号", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      confirm: [
        { required: true, message: "请再次输入密码", trigger: "blur" },
        {
          validator: (_, v, cb) => {
            if (v !== form.password) cb(new Error("两次密码不一致"));
            else cb();
          },
          trigger: "blur"
        }
      ]
    };
    const loading = vueExports.ref(false);
    const submit = async () => {
      formRef.value?.validate(async (valid) => {
        if (!valid) return;
        loading.value = true;
        try {
          const { error } = await useFetch("/api/auth/register", {
            method: "POST",
            server: false,
            body: { username: form.username, password: form.password }
          }, "$FxXnWOHBbD");
          if (error.value) throw error.value;
          ElMessage.success("注册成功，已登录");
          navigateTo("/");
        } catch (e) {
          ElMessage.error("注册失败：用户名已存在或服务器错误");
        } finally {
          loading.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_card = vueExports.resolveComponent("el-card");
      const _component_el_form = vueExports.resolveComponent("el-form");
      const _component_el_form_item = vueExports.resolveComponent("el-form-item");
      const _component_el_input = vueExports.resolveComponent("el-input");
      const _component_el_button = vueExports.resolveComponent("el-button");
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ class: "login-container" }, _attrs))} data-v-e57f021f><div class="login-panel" data-v-e57f021f><div class="panel-left" data-v-e57f021f><div class="brand" data-v-e57f021f><div class="brand-logo" data-v-e57f021f>Nuxt</div><div class="brand-title" data-v-e57f021f>企业后台管理系统</div><div class="brand-desc" data-v-e57f021f>欢迎注册新账户</div></div></div><div class="panel-right" data-v-e57f021f>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_card, {
        class: "login-card",
        shadow: "never"
      }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-header" data-v-e57f021f${_scopeId}><div class="logo" data-v-e57f021f${_scopeId}>EP</div><div class="title" data-v-e57f021f${_scopeId}><h2 data-v-e57f021f${_scopeId}>用户注册</h2><p data-v-e57f021f${_scopeId}>请输入账号与密码</p></div></div>`);
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
                          type: "password",
                          placeholder: "请输入密码",
                          "prefix-icon": vueExports.unref(Lock),
                          clearable: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_el_input, {
                            modelValue: form.password,
                            "onUpdate:modelValue": ($event) => form.password = $event,
                            type: "password",
                            placeholder: "请输入密码",
                            "prefix-icon": vueExports.unref(Lock),
                            clearable: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_form_item, {
                    label: "确认密码",
                    prop: "confirm"
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_input, {
                          modelValue: form.confirm,
                          "onUpdate:modelValue": ($event) => form.confirm = $event,
                          type: "password",
                          placeholder: "请再次输入密码",
                          "prefix-icon": vueExports.unref(Lock),
                          clearable: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_el_input, {
                            modelValue: form.confirm,
                            "onUpdate:modelValue": ($event) => form.confirm = $event,
                            type: "password",
                            placeholder: "请再次输入密码",
                            "prefix-icon": vueExports.unref(Lock),
                            clearable: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
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
                        _push4(` 注册并登录 `);
                      } else {
                        return [
                          vueExports.createTextVNode(" 注册并登录 ")
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
                          type: "password",
                          placeholder: "请输入密码",
                          "prefix-icon": vueExports.unref(Lock),
                          clearable: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_el_form_item, {
                      label: "确认密码",
                      prop: "confirm"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_el_input, {
                          modelValue: form.confirm,
                          "onUpdate:modelValue": ($event) => form.confirm = $event,
                          type: "password",
                          placeholder: "请再次输入密码",
                          "prefix-icon": vueExports.unref(Lock),
                          clearable: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_el_button, {
                      class: "submit-btn",
                      type: "primary",
                      size: "large",
                      loading: loading.value,
                      onClick: submit,
                      block: ""
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(" 注册并登录 ")
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
                  vueExports.createVNode("h2", null, "用户注册"),
                  vueExports.createVNode("p", null, "请输入账号与密码")
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
                        type: "password",
                        placeholder: "请输入密码",
                        "prefix-icon": vueExports.unref(Lock),
                        clearable: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_el_form_item, {
                    label: "确认密码",
                    prop: "confirm"
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_el_input, {
                        modelValue: form.confirm,
                        "onUpdate:modelValue": ($event) => form.confirm = $event,
                        type: "password",
                        placeholder: "请再次输入密码",
                        "prefix-icon": vueExports.unref(Lock),
                        clearable: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_el_button, {
                    class: "submit-btn",
                    type: "primary",
                    size: "large",
                    loading: loading.value,
                    onClick: submit,
                    block: ""
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createTextVNode(" 注册并登录 ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e57f021f"]]);

export { register as default };
//# sourceMappingURL=register-CicM10DC.mjs.map
