import { _ as _export_sfc, v as vueExports, j as useRoute, k as useRouter, s as serverRenderer_cjs_prodExports } from './server.mjs';
import { HomeFilled } from '@element-plus/icons-vue';
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
import 'node:stream';

const THEME_KEY = "dashboard_theme";
const ASIDE_COLLAPSE_KEY = "aside_collapse";
const TABS_KEY = "route_tabs";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const activePath = vueExports.ref(route.path);
    const isDark = vueExports.ref(false);
    const isCollapsed = vueExports.ref(false);
    const asideWidth = vueExports.computed(() => isCollapsed.value ? "64px" : "200px");
    const breadcrumbItems = vueExports.computed(() => {
      const matched = route.matched.filter((r) => r.path && r.path !== "/");
      const items = matched.map((r) => ({
        title: r.meta?.title || r.name || "未命名",
        to: r.path !== route.path ? r.path : void 0
      }));
      return items.length ? items : [{ title: "首页", to: "/home" }];
    });
    const applyTheme = (dark) => {
    };
    const toggleTheme = () => {
      isDark.value = !isDark.value;
      localStorage.setItem(THEME_KEY, isDark.value ? "dark" : "light");
      applyTheme(isDark.value);
    };
    const toggleAside = () => {
      isCollapsed.value = !isCollapsed.value;
      localStorage.setItem(ASIDE_COLLAPSE_KEY, isCollapsed.value ? "1" : "0");
    };
    const goHome = () => router.push("/home");
    const tabs = vueExports.ref([]);
    const ensureTab = (r) => {
      const title = r.meta?.title || r.name || r.path;
      if (!tabs.value.find((t) => t.path === r.path)) {
        tabs.value.push({ path: r.path, title });
        persistTabs();
      }
      activePath.value = r.path;
    };
    const persistTabs = () => {
      try {
        sessionStorage.setItem(TABS_KEY, JSON.stringify(tabs.value));
      } catch {
      }
    };
    vueExports.watch(() => route.path, () => ensureTab(route));
    const onTabClick = (pane) => {
      if (pane?.paneName && pane.paneName !== route.path) router.push(pane.paneName);
    };
    const onTabRemove = (name) => {
      const idx = tabs.value.findIndex((t) => t.path === name);
      if (idx >= 0) {
        const removedIsActive = name === route.path;
        tabs.value.splice(idx, 1);
        persistTabs();
        if (removedIsActive) {
          const next = tabs.value[idx] || tabs.value[idx - 1] || { path: "/home" };
          router.push(next.path);
        }
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_container = vueExports.resolveComponent("el-container");
      const _component_el_header = vueExports.resolveComponent("el-header");
      const _component_el_button = vueExports.resolveComponent("el-button");
      const _component_el_icon = vueExports.resolveComponent("el-icon");
      const _component_el_breadcrumb = vueExports.resolveComponent("el-breadcrumb");
      const _component_el_breadcrumb_item = vueExports.resolveComponent("el-breadcrumb-item");
      const _component_el_divider = vueExports.resolveComponent("el-divider");
      const _component_el_aside = vueExports.resolveComponent("el-aside");
      const _component_el_scrollbar = vueExports.resolveComponent("el-scrollbar");
      const _component_el_menu = vueExports.resolveComponent("el-menu");
      const _component_el_menu_item = vueExports.resolveComponent("el-menu-item");
      const _component_el_main = vueExports.resolveComponent("el-main");
      const _component_el_tabs = vueExports.resolveComponent("el-tabs");
      const _component_el_tab_pane = vueExports.resolveComponent("el-tab-pane");
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_container, vueExports.mergeProps({ class: "app-layout" }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_header, {
              class: "app-header",
              height: "56px"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="header-left" data-v-de4728b0${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_button, {
                    text: "",
                    circle: "",
                    class: "collapse-btn",
                    onClick: toggleAside,
                    title: isCollapsed.value ? "展开侧边栏" : "折叠侧边栏"
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_icon, null, {
                          default: vueExports.withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              serverRenderer_cjs_prodExports.ssrRenderVNode(_push5, vueExports.createVNode(vueExports.resolveDynamicComponent(isCollapsed.value ? "Expand" : "Fold"), null, null), _parent5, _scopeId4);
                            } else {
                              return [
                                (vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(isCollapsed.value ? "Expand" : "Fold")))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_el_icon, null, {
                            default: vueExports.withCtx(() => [
                              (vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(isCollapsed.value ? "Expand" : "Fold")))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="brand" data-v-de4728b0${_scopeId2}>Nuxt Admin</div>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_breadcrumb, { separator: "/" }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        serverRenderer_cjs_prodExports.ssrRenderList(breadcrumbItems.value, (bc, idx) => {
                          _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_breadcrumb_item, vueExports.mergeProps({
                            key: idx,
                            to: bc.to
                          }, { ref_for: true }, bc.to ? { to: bc.to } : {}), {
                            default: vueExports.withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${serverRenderer_cjs_prodExports.ssrInterpolate(bc.title)}`);
                              } else {
                                return [
                                  vueExports.createTextVNode(vueExports.toDisplayString(bc.title), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(breadcrumbItems.value, (bc, idx) => {
                            return vueExports.openBlock(), vueExports.createBlock(_component_el_breadcrumb_item, vueExports.mergeProps({
                              key: idx,
                              to: bc.to
                            }, { ref_for: true }, bc.to ? { to: bc.to } : {}), {
                              default: vueExports.withCtx(() => [
                                vueExports.createTextVNode(vueExports.toDisplayString(bc.title), 1)
                              ]),
                              _: 2
                            }, 1040, ["to"]);
                          }), 128))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="header-right" data-v-de4728b0${_scopeId2}>`);
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_button, {
                    link: "",
                    onClick: toggleTheme
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${serverRenderer_cjs_prodExports.ssrInterpolate(isDark.value ? "暗色" : "明亮")}`);
                      } else {
                        return [
                          vueExports.createTextVNode(vueExports.toDisplayString(isDark.value ? "暗色" : "明亮"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_divider, { direction: "vertical" }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_button, {
                    link: "",
                    onClick: goHome
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`仪表盘`);
                      } else {
                        return [
                          vueExports.createTextVNode("仪表盘")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    vueExports.createVNode("div", { class: "header-left" }, [
                      vueExports.createVNode(_component_el_button, {
                        text: "",
                        circle: "",
                        class: "collapse-btn",
                        onClick: toggleAside,
                        title: isCollapsed.value ? "展开侧边栏" : "折叠侧边栏"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_el_icon, null, {
                            default: vueExports.withCtx(() => [
                              (vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(isCollapsed.value ? "Expand" : "Fold")))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["title"]),
                      vueExports.createVNode("div", { class: "brand" }, "Nuxt Admin"),
                      vueExports.createVNode(_component_el_breadcrumb, { separator: "/" }, {
                        default: vueExports.withCtx(() => [
                          (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(breadcrumbItems.value, (bc, idx) => {
                            return vueExports.openBlock(), vueExports.createBlock(_component_el_breadcrumb_item, vueExports.mergeProps({
                              key: idx,
                              to: bc.to
                            }, { ref_for: true }, bc.to ? { to: bc.to } : {}), {
                              default: vueExports.withCtx(() => [
                                vueExports.createTextVNode(vueExports.toDisplayString(bc.title), 1)
                              ]),
                              _: 2
                            }, 1040, ["to"]);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ]),
                    vueExports.createVNode("div", { class: "header-right" }, [
                      vueExports.createVNode(_component_el_button, {
                        link: "",
                        onClick: toggleTheme
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(isDark.value ? "暗色" : "明亮"), 1)
                        ]),
                        _: 1
                      }),
                      vueExports.createVNode(_component_el_divider, { direction: "vertical" }),
                      vueExports.createVNode(_component_el_button, {
                        link: "",
                        onClick: goHome
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode("仪表盘")
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_container, { class: "app-body" }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_aside, {
                    class: "app-aside",
                    width: asideWidth.value
                  }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_scrollbar, null, {
                          default: vueExports.withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_menu, {
                                "default-active": activePath.value,
                                router: "",
                                collapse: isCollapsed.value
                              }, {
                                default: vueExports.withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_menu_item, { index: "/home" }, {
                                      default: vueExports.withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_icon, null, {
                                            default: vueExports.withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(serverRenderer_cjs_prodExports.ssrRenderComponent(vueExports.unref(HomeFilled), null, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  vueExports.createVNode(vueExports.unref(HomeFilled))
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(`<span data-v-de4728b0${_scopeId6}>仪表盘</span>`);
                                        } else {
                                          return [
                                            vueExports.createVNode(_component_el_icon, null, {
                                              default: vueExports.withCtx(() => [
                                                vueExports.createVNode(vueExports.unref(HomeFilled))
                                              ]),
                                              _: 1
                                            }),
                                            vueExports.createVNode("span", null, "仪表盘")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      vueExports.createVNode(_component_el_menu_item, { index: "/home" }, {
                                        default: vueExports.withCtx(() => [
                                          vueExports.createVNode(_component_el_icon, null, {
                                            default: vueExports.withCtx(() => [
                                              vueExports.createVNode(vueExports.unref(HomeFilled))
                                            ]),
                                            _: 1
                                          }),
                                          vueExports.createVNode("span", null, "仪表盘")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                vueExports.createVNode(_component_el_menu, {
                                  "default-active": activePath.value,
                                  router: "",
                                  collapse: isCollapsed.value
                                }, {
                                  default: vueExports.withCtx(() => [
                                    vueExports.createVNode(_component_el_menu_item, { index: "/home" }, {
                                      default: vueExports.withCtx(() => [
                                        vueExports.createVNode(_component_el_icon, null, {
                                          default: vueExports.withCtx(() => [
                                            vueExports.createVNode(vueExports.unref(HomeFilled))
                                          ]),
                                          _: 1
                                        }),
                                        vueExports.createVNode("span", null, "仪表盘")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["default-active", "collapse"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_el_scrollbar, null, {
                            default: vueExports.withCtx(() => [
                              vueExports.createVNode(_component_el_menu, {
                                "default-active": activePath.value,
                                router: "",
                                collapse: isCollapsed.value
                              }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.createVNode(_component_el_menu_item, { index: "/home" }, {
                                    default: vueExports.withCtx(() => [
                                      vueExports.createVNode(_component_el_icon, null, {
                                        default: vueExports.withCtx(() => [
                                          vueExports.createVNode(vueExports.unref(HomeFilled))
                                        ]),
                                        _: 1
                                      }),
                                      vueExports.createVNode("span", null, "仪表盘")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["default-active", "collapse"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_main, { class: "app-main" }, {
                    default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="tabs" data-v-de4728b0${_scopeId3}>`);
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_tabs, {
                          modelValue: activePath.value,
                          "onUpdate:modelValue": ($event) => activePath.value = $event,
                          type: "card",
                          onTabClick,
                          onTabRemove,
                          closable: ""
                        }, {
                          default: vueExports.withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              serverRenderer_cjs_prodExports.ssrRenderList(tabs.value, (t) => {
                                _push5(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_tab_pane, {
                                  key: t.path,
                                  name: t.path,
                                  label: t.title,
                                  closable: t.path !== "/home"
                                }, null, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(tabs.value, (t) => {
                                  return vueExports.openBlock(), vueExports.createBlock(_component_el_tab_pane, {
                                    key: t.path,
                                    name: t.path,
                                    label: t.title,
                                    closable: t.path !== "/home"
                                  }, null, 8, ["name", "label", "closable"]);
                                }), 128))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                        serverRenderer_cjs_prodExports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          vueExports.createVNode("div", { class: "tabs" }, [
                            vueExports.createVNode(_component_el_tabs, {
                              modelValue: activePath.value,
                              "onUpdate:modelValue": ($event) => activePath.value = $event,
                              type: "card",
                              onTabClick,
                              onTabRemove,
                              closable: ""
                            }, {
                              default: vueExports.withCtx(() => [
                                (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(tabs.value, (t) => {
                                  return vueExports.openBlock(), vueExports.createBlock(_component_el_tab_pane, {
                                    key: t.path,
                                    name: t.path,
                                    label: t.title,
                                    closable: t.path !== "/home"
                                  }, null, 8, ["name", "label", "closable"]);
                                }), 128))
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          vueExports.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_el_aside, {
                      class: "app-aside",
                      width: asideWidth.value
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_el_scrollbar, null, {
                          default: vueExports.withCtx(() => [
                            vueExports.createVNode(_component_el_menu, {
                              "default-active": activePath.value,
                              router: "",
                              collapse: isCollapsed.value
                            }, {
                              default: vueExports.withCtx(() => [
                                vueExports.createVNode(_component_el_menu_item, { index: "/home" }, {
                                  default: vueExports.withCtx(() => [
                                    vueExports.createVNode(_component_el_icon, null, {
                                      default: vueExports.withCtx(() => [
                                        vueExports.createVNode(vueExports.unref(HomeFilled))
                                      ]),
                                      _: 1
                                    }),
                                    vueExports.createVNode("span", null, "仪表盘")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["default-active", "collapse"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["width"]),
                    vueExports.createVNode(_component_el_main, { class: "app-main" }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("div", { class: "tabs" }, [
                          vueExports.createVNode(_component_el_tabs, {
                            modelValue: activePath.value,
                            "onUpdate:modelValue": ($event) => activePath.value = $event,
                            type: "card",
                            onTabClick,
                            onTabRemove,
                            closable: ""
                          }, {
                            default: vueExports.withCtx(() => [
                              (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(tabs.value, (t) => {
                                return vueExports.openBlock(), vueExports.createBlock(_component_el_tab_pane, {
                                  key: t.path,
                                  name: t.path,
                                  label: t.title,
                                  closable: t.path !== "/home"
                                }, null, 8, ["name", "label", "closable"]);
                              }), 128))
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        vueExports.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                      ]),
                      _: 3
                    })
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_el_header, {
                class: "app-header",
                height: "56px"
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode("div", { class: "header-left" }, [
                    vueExports.createVNode(_component_el_button, {
                      text: "",
                      circle: "",
                      class: "collapse-btn",
                      onClick: toggleAside,
                      title: isCollapsed.value ? "展开侧边栏" : "折叠侧边栏"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode(_component_el_icon, null, {
                          default: vueExports.withCtx(() => [
                            (vueExports.openBlock(), vueExports.createBlock(vueExports.resolveDynamicComponent(isCollapsed.value ? "Expand" : "Fold")))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["title"]),
                    vueExports.createVNode("div", { class: "brand" }, "Nuxt Admin"),
                    vueExports.createVNode(_component_el_breadcrumb, { separator: "/" }, {
                      default: vueExports.withCtx(() => [
                        (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(breadcrumbItems.value, (bc, idx) => {
                          return vueExports.openBlock(), vueExports.createBlock(_component_el_breadcrumb_item, vueExports.mergeProps({
                            key: idx,
                            to: bc.to
                          }, { ref_for: true }, bc.to ? { to: bc.to } : {}), {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(bc.title), 1)
                            ]),
                            _: 2
                          }, 1040, ["to"]);
                        }), 128))
                      ]),
                      _: 1
                    })
                  ]),
                  vueExports.createVNode("div", { class: "header-right" }, [
                    vueExports.createVNode(_component_el_button, {
                      link: "",
                      onClick: toggleTheme
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode(vueExports.toDisplayString(isDark.value ? "暗色" : "明亮"), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_el_divider, { direction: "vertical" }),
                    vueExports.createVNode(_component_el_button, {
                      link: "",
                      onClick: goHome
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createTextVNode("仪表盘")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_el_container, { class: "app-body" }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_el_aside, {
                    class: "app-aside",
                    width: asideWidth.value
                  }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode(_component_el_scrollbar, null, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode(_component_el_menu, {
                            "default-active": activePath.value,
                            router: "",
                            collapse: isCollapsed.value
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createVNode(_component_el_menu_item, { index: "/home" }, {
                                default: vueExports.withCtx(() => [
                                  vueExports.createVNode(_component_el_icon, null, {
                                    default: vueExports.withCtx(() => [
                                      vueExports.createVNode(vueExports.unref(HomeFilled))
                                    ]),
                                    _: 1
                                  }),
                                  vueExports.createVNode("span", null, "仪表盘")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["default-active", "collapse"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["width"]),
                  vueExports.createVNode(_component_el_main, { class: "app-main" }, {
                    default: vueExports.withCtx(() => [
                      vueExports.createVNode("div", { class: "tabs" }, [
                        vueExports.createVNode(_component_el_tabs, {
                          modelValue: activePath.value,
                          "onUpdate:modelValue": ($event) => activePath.value = $event,
                          type: "card",
                          onTabClick,
                          onTabRemove,
                          closable: ""
                        }, {
                          default: vueExports.withCtx(() => [
                            (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(tabs.value, (t) => {
                              return vueExports.openBlock(), vueExports.createBlock(_component_el_tab_pane, {
                                key: t.path,
                                name: t.path,
                                label: t.title,
                                closable: t.path !== "/home"
                              }, null, 8, ["name", "label", "closable"]);
                            }), 128))
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      vueExports.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                    ]),
                    _: 3
                  })
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-de4728b0"]]);

export { _default as default };
//# sourceMappingURL=default-C3y1ffZv.mjs.map
