import { _ as _export_sfc, v as vueExports, s as serverRenderer_cjs_prodExports, n as navigateTo, d as __nuxt_component_0$1 } from './server.mjs';
import { ElMessage } from 'element-plus';
import { u as useFetch } from './fetch-7W5VOGai.mjs';
import VChart from 'vue-echarts';
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
import '@element-plus/icons-vue';
import 'node:stream';

const _sfc_main$1 = /* @__PURE__ */ vueExports.defineComponent({
  __name: "ChartCard",
  __ssrInlineRender: true,
  props: {
    option: {},
    shadow: { default: "never" },
    rootMargin: { default: "100px" },
    height: { default: "320px" }
  },
  setup(__props) {
    const holder = vueExports.ref(null);
    const isVisible = vueExports.ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_card = vueExports.resolveComponent("el-card");
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_el_skeleton = vueExports.resolveComponent("el-skeleton");
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_card, vueExports.mergeProps({
        shadow: __props.shadow,
        class: ["chart-card", { "is-loading": !isVisible.value }],
        style: { height: __props.height }
      }, _attrs), {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_ClientOnly, null, {}, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_ClientOnly, null, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode("div", {
                    ref_key: "holder",
                    ref: holder,
                    class: "chart-holder",
                    style: { height: __props.height }
                  }, [
                    isVisible.value ? (vueExports.openBlock(), vueExports.createBlock(vueExports.unref(VChart), {
                      key: 0,
                      class: "chart",
                      option: __props.option,
                      autoresize: ""
                    }, null, 8, ["option"])) : (vueExports.openBlock(), vueExports.createBlock("div", {
                      key: 1,
                      class: "chart-skeleton"
                    }, [
                      vueExports.createVNode(_component_el_skeleton, {
                        rows: 4,
                        animated: ""
                      })
                    ]))
                  ], 4)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChartCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ChartCard = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-d3b73a22"]]), { __name: "ChartCard" });
const THEME_KEY = "dashboard_theme";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "home",
  __ssrInlineRender: true,
  setup(__props) {
    const logout = async () => {
      const { error } = await useFetch("/api/auth/logout", { method: "POST", server: false }, "$5viT2XL0Z0");
      if (error.value) {
        ElMessage.error("退出失败，请重试");
        return;
      }
      ElMessage.success("已退出登录");
      navigateTo("/login");
    };
    const isDark = vueExports.ref(false);
    vueExports.watch(isDark, (val) => {
      localStorage.setItem(THEME_KEY, val ? "dark" : "light");
    });
    vueExports.computed(() => isDark.value ? "暗色" : "明亮");
    const pageLoading = vueExports.ref(true);
    const containerRef = vueExports.ref(null);
    const isFullscreen = vueExports.ref(false);
    const enterFullscreen = async () => {
      const el = containerRef.value;
      if (el && !(void 0).fullscreenElement) {
        await el.requestFullscreen();
      }
    };
    const exitFullscreen = async () => {
      if ((void 0).fullscreenElement) {
        await (void 0).exitFullscreen();
      }
    };
    const toggleFullscreen = async () => {
      if ((void 0).fullscreenElement) {
        await exitFullscreen();
      } else {
        await enterFullscreen();
      }
    };
    const statCards = vueExports.ref([
      { title: "访问量", value: 12890, trend: "+12.3%", color: "#4C6EF5" },
      { title: "注册用户", value: 5230, trend: "+3.1%", color: "#20C997" },
      { title: "订单数", value: 1876, trend: "-1.2%", color: "#FAB005" },
      { title: "转化率", value: "3.85%", trend: "+0.4%", color: "#FA5252" }
    ]);
    const axisColor = vueExports.computed(() => isDark.value ? "#cfd3dc" : "#606266");
    const textColor = vueExports.computed(() => isDark.value ? "#e5eaf3" : "#303133");
    const gridColor = vueExports.computed(() => isDark.value ? "#2B2F36" : "#EBEEF5");
    const lineOption = vueExports.computed(() => ({
      title: { text: "近七日访问趋势", left: "center", top: 8, textStyle: { fontSize: 14, color: textColor.value } },
      tooltip: { trigger: "axis" },
      toolbox: { right: 10, feature: { saveAsImage: {}, dataZoom: {}, magicType: { type: ["line", "bar"] } } },
      dataZoom: [{ type: "inside" }, { type: "slider" }],
      grid: { left: 40, right: 20, top: 50, bottom: 30 },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        axisLine: { lineStyle: { color: axisColor.value } },
        axisLabel: { color: axisColor.value }
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: gridColor.value } },
        axisLabel: { color: axisColor.value }
      },
      series: [{
        name: "访问量",
        type: "line",
        smooth: true,
        data: [1200, 980, 1500, 1100, 1660, 1820, 2010],
        areaStyle: {},
        itemStyle: { color: "#4C6EF5" }
      }]
    }));
    const pieOption = vueExports.computed(() => ({
      title: { text: "渠道占比", left: "center", top: 8, textStyle: { fontSize: 14, color: textColor.value } },
      tooltip: { trigger: "item" },
      legend: { bottom: 0, textStyle: { color: axisColor.value } },
      series: [{
        name: "占比",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "48%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
        label: { color: textColor.value },
        data: [
          { value: 48, name: "官网" },
          { value: 22, name: "小程序" },
          { value: 18, name: "App" },
          { value: 12, name: "第三方" }
        ]
      }]
    }));
    const barOption = vueExports.computed(() => ({
      title: { text: "品类销量", left: "center", top: 8, textStyle: { fontSize: 14, color: textColor.value } },
      tooltip: { trigger: "axis" },
      toolbox: { right: 10, feature: { saveAsImage: {}, dataZoom: {}, magicType: { type: ["line", "bar"] } } },
      brush: { toolbox: ["rect", "clear"], xAxisIndex: "all" },
      dataZoom: [{ type: "inside" }, { type: "slider" }],
      grid: { left: 40, right: 20, top: 50, bottom: 30 },
      xAxis: {
        type: "category",
        data: ["家电", "数码", "美妆", "服饰", "食品", "母婴"],
        axisLine: { lineStyle: { color: axisColor.value } },
        axisLabel: { color: axisColor.value }
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: gridColor.value } },
        axisLabel: { color: axisColor.value }
      },
      series: [{
        name: "销量",
        type: "bar",
        barWidth: 18,
        data: [620, 732, 701, 534, 690, 830],
        itemStyle: { color: "#20C997" }
      }]
    }));
    const dualLineOption = vueExports.computed(() => ({
      title: { text: "UV / PV 趋势（双轴）", left: "center", top: 8, textStyle: { fontSize: 14, color: textColor.value } },
      tooltip: { trigger: "axis" },
      toolbox: { right: 10, feature: { saveAsImage: {}, dataZoom: {} } },
      dataZoom: [{ type: "inside" }, { type: "slider" }],
      grid: { left: 50, right: 50, top: 50, bottom: 30 },
      legend: { top: 28, textStyle: { color: axisColor.value } },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisLine: { lineStyle: { color: axisColor.value } },
        axisLabel: { color: axisColor.value }
      },
      yAxis: [
        { type: "value", name: "UV", position: "left", axisLabel: { color: axisColor.value }, splitLine: { lineStyle: { color: gridColor.value } } },
        { type: "value", name: "PV", position: "right", axisLabel: { color: axisColor.value } }
      ],
      series: [
        { name: "UV", type: "line", smooth: true, yAxisIndex: 0, itemStyle: { color: "#36cfc9" }, data: [320, 402, 391, 434, 590, 630, 710] },
        { name: "PV", type: "line", smooth: true, yAxisIndex: 1, itemStyle: { color: "#9254de" }, data: [820, 932, 901, 934, 1290, 1330, 1520] }
      ]
    }));
    const stackedBarOption = vueExports.computed(() => ({
      title: { text: "渠道流量构成（堆叠）", left: "center", top: 8, textStyle: { fontSize: 14, color: textColor.value } },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { top: 28, textStyle: { color: axisColor.value } },
      toolbox: { right: 10, feature: { saveAsImage: {}, dataZoom: {} } },
      brush: { toolbox: ["rect", "clear"], xAxisIndex: "all" },
      dataZoom: [{ type: "inside" }, { type: "slider" }],
      grid: { left: 50, right: 20, top: 60, bottom: 30 },
      xAxis: {
        type: "category",
        data: ["1月", "2月", "3月", "4月", "5月", "6月"],
        axisLine: { lineStyle: { color: axisColor.value } },
        axisLabel: { color: axisColor.value }
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: gridColor.value } },
        axisLabel: { color: axisColor.value }
      },
      series: [
        { name: "官网", type: "bar", stack: "total", emphasis: { focus: "series" }, itemStyle: { color: "#409EFF" }, data: [320, 302, 301, 334, 390, 330] },
        { name: "App", type: "bar", stack: "total", emphasis: { focus: "series" }, itemStyle: { color: "#67C23A" }, data: [120, 132, 101, 134, 90, 230] },
        { name: "小程序", type: "bar", stack: "total", emphasis: { focus: "series" }, itemStyle: { color: "#E6A23C" }, data: [220, 182, 191, 234, 290, 330] },
        { name: "第三方", type: "bar", stack: "total", emphasis: { focus: "series" }, itemStyle: { color: "#F56C6C" }, data: [150, 212, 201, 154, 190, 120] }
      ]
    }));
    const funnelOption = vueExports.computed(() => ({
      title: { text: "转化漏斗", left: "center", top: 8, textStyle: { fontSize: 14, color: textColor.value } },
      tooltip: { trigger: "item", formatter: "{b}: {c}%" },
      series: [{
        name: "转化",
        type: "funnel",
        left: "10%",
        width: "80%",
        label: { color: textColor.value },
        data: [
          { value: 100, name: "曝光" },
          { value: 72, name: "访问" },
          { value: 38, name: "加购" },
          { value: 22, name: "下单" },
          { value: 15, name: "支付" }
        ]
      }]
    }));
    vueExports.ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_switch = vueExports.resolveComponent("el-switch");
      const _component_el_button = vueExports.resolveComponent("el-button");
      const _component_el_divider = vueExports.resolveComponent("el-divider");
      const _component_el_row = vueExports.resolveComponent("el-row");
      const _component_el_col = vueExports.resolveComponent("el-col");
      const _component_el_card = vueExports.resolveComponent("el-card");
      const _component_el_table = vueExports.resolveComponent("el-table");
      const _component_el_table_column = vueExports.resolveComponent("el-table-column");
      const _component_el_tag = vueExports.resolveComponent("el-tag");
      const _directive_loading = vueExports.resolveDirective("loading");
      _push(`<div${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({
        class: "dashboard",
        ref_key: "containerRef",
        ref: containerRef
      }, _attrs, serverRenderer_cjs_prodExports.ssrGetDirectiveProps(_ctx, _directive_loading, pageLoading.value)))} data-v-94e61e2b><div class="header" data-v-94e61e2b><div class="title" data-v-94e61e2b><h2 data-v-94e61e2b>运营驾驶舱</h2><p data-v-94e61e2b>核心业务指标总览 · 实时洞察</p></div><div class="header-actions" data-v-94e61e2b>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_switch, {
        modelValue: isDark.value,
        "onUpdate:modelValue": ($event) => isDark.value = $event,
        "inline-prompt": "",
        "active-text": "暗色",
        "inactive-text": "明亮"
      }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_button, { onClick: toggleFullscreen }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer_cjs_prodExports.ssrInterpolate(isFullscreen.value ? "退出全屏" : "全屏展示")}`);
          } else {
            return [
              vueExports.createTextVNode(vueExports.toDisplayString(isFullscreen.value ? "退出全屏" : "全屏展示"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_divider, { direction: "vertical" }, null, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_button, { onClick: logout }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`退出登录`);
          } else {
            return [
              vueExports.createTextVNode("退出登录")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_button, { type: "primary" }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`刷新数据`);
          } else {
            return [
              vueExports.createTextVNode("刷新数据")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="grid" data-v-94e61e2b><div class="grid-row" data-v-94e61e2b>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_row, { gutter: 12 }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            serverRenderer_cjs_prodExports.ssrRenderList(statCards.value, (card, idx) => {
              _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_col, {
                xs: 12,
                sm: 12,
                md: 6,
                key: idx
              }, {
                default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_card, {
                      shadow: "hover",
                      class: "stat-card"
                    }, {
                      default: vueExports.withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="stat" data-v-94e61e2b${_scopeId3}><div class="label" data-v-94e61e2b${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(card.title)}</div><div class="value" style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ color: card.color })}" data-v-94e61e2b${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(card.value)}</div><div class="trend" data-v-94e61e2b${_scopeId3}>${serverRenderer_cjs_prodExports.ssrInterpolate(card.trend)}</div></div>`);
                        } else {
                          return [
                            vueExports.createVNode("div", { class: "stat" }, [
                              vueExports.createVNode("div", { class: "label" }, vueExports.toDisplayString(card.title), 1),
                              vueExports.createVNode("div", {
                                class: "value",
                                style: { color: card.color }
                              }, vueExports.toDisplayString(card.value), 5),
                              vueExports.createVNode("div", { class: "trend" }, vueExports.toDisplayString(card.trend), 1)
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      vueExports.createVNode(_component_el_card, {
                        shadow: "hover",
                        class: "stat-card"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createVNode("div", { class: "stat" }, [
                            vueExports.createVNode("div", { class: "label" }, vueExports.toDisplayString(card.title), 1),
                            vueExports.createVNode("div", {
                              class: "value",
                              style: { color: card.color }
                            }, vueExports.toDisplayString(card.value), 5),
                            vueExports.createVNode("div", { class: "trend" }, vueExports.toDisplayString(card.trend), 1)
                          ])
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (vueExports.openBlock(true), vueExports.createBlock(vueExports.Fragment, null, vueExports.renderList(statCards.value, (card, idx) => {
                return vueExports.openBlock(), vueExports.createBlock(_component_el_col, {
                  xs: 12,
                  sm: 12,
                  md: 6,
                  key: idx
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createVNode(_component_el_card, {
                      shadow: "hover",
                      class: "stat-card"
                    }, {
                      default: vueExports.withCtx(() => [
                        vueExports.createVNode("div", { class: "stat" }, [
                          vueExports.createVNode("div", { class: "label" }, vueExports.toDisplayString(card.title), 1),
                          vueExports.createVNode("div", {
                            class: "value",
                            style: { color: card.color }
                          }, vueExports.toDisplayString(card.value), 5),
                          vueExports.createVNode("div", { class: "trend" }, vueExports.toDisplayString(card.trend), 1)
                        ])
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid-row" data-v-94e61e2b>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_row, { gutter: 12 }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_col, {
              xs: 24,
              md: 16
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(ChartCard, {
                    option: lineOption.value,
                    height: "320px"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(ChartCard, {
                      option: lineOption.value,
                      height: "320px"
                    }, null, 8, ["option"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_col, {
              xs: 24,
              md: 8
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(ChartCard, {
                    option: pieOption.value,
                    height: "320px"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(ChartCard, {
                      option: pieOption.value,
                      height: "320px"
                    }, null, 8, ["option"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_el_col, {
                xs: 24,
                md: 16
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(ChartCard, {
                    option: lineOption.value,
                    height: "320px"
                  }, null, 8, ["option"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_el_col, {
                xs: 24,
                md: 8
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(ChartCard, {
                    option: pieOption.value,
                    height: "320px"
                  }, null, 8, ["option"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid-row" data-v-94e61e2b>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(ChartCard, {
        option: dualLineOption.value,
        height: "340px"
      }, null, _parent));
      _push(`</div><div class="grid-row" data-v-94e61e2b>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(ChartCard, {
        option: funnelOption.value,
        height: "340px"
      }, null, _parent));
      _push(`</div><div class="grid-row" data-v-94e61e2b>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_row, { gutter: 12 }, {
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_col, {
              xs: 24,
              md: 14
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(ChartCard, {
                    option: stackedBarOption.value,
                    height: "340px"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(ChartCard, {
                      option: stackedBarOption.value,
                      height: "340px"
                    }, null, 8, ["option"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_col, {
              xs: 24,
              md: 10
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(ChartCard, {
                    option: barOption.value,
                    height: "340px"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(ChartCard, {
                      option: barOption.value,
                      height: "340px"
                    }, null, 8, ["option"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_el_col, {
                xs: 24,
                md: 14
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(ChartCard, {
                    option: stackedBarOption.value,
                    height: "340px"
                  }, null, 8, ["option"])
                ]),
                _: 1
              }),
              vueExports.createVNode(_component_el_col, {
                xs: 24,
                md: 10
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(ChartCard, {
                    option: barOption.value,
                    height: "340px"
                  }, null, 8, ["option"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid-row" data-v-94e61e2b>`);
      _push(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_card, { shadow: "never" }, {
        header: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="table-header" data-v-94e61e2b${_scopeId}><span data-v-94e61e2b${_scopeId}>最新订单</span>`);
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_button, {
              link: "",
              type: "primary"
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`查看全部`);
                } else {
                  return [
                    vueExports.createTextVNode("查看全部")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              vueExports.createVNode("div", { class: "table-header" }, [
                vueExports.createVNode("span", null, "最新订单"),
                vueExports.createVNode(_component_el_button, {
                  link: "",
                  type: "primary"
                }, {
                  default: vueExports.withCtx(() => [
                    vueExports.createTextVNode("查看全部")
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        default: vueExports.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_table, {
              size: "small",
              border: "",
              data: [
                { id: "A20251016001", user: "Alice", amount: 1299, status: "已支付", time: "09:12" },
                { id: "A20251016002", user: "Bob", amount: 289, status: "已发货", time: "09:18" },
                { id: "A20251016003", user: "Cindy", amount: 569, status: "待支付", time: "09:22" },
                { id: "A20251016004", user: "David", amount: 78, status: "已完成", time: "09:31" },
                { id: "A20251016005", user: "Eve", amount: 2199, status: "已完成", time: "09:34" }
              ]
            }, {
              default: vueExports.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_table_column, {
                    prop: "id",
                    label: "订单号",
                    "min-width": "160"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_table_column, {
                    prop: "user",
                    label: "用户",
                    "min-width": "100"
                  }, null, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_table_column, {
                    prop: "amount",
                    label: "金额",
                    "min-width": "80"
                  }, {
                    default: vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`¥ ${serverRenderer_cjs_prodExports.ssrInterpolate(row.amount)}`);
                      } else {
                        return [
                          vueExports.createTextVNode("¥ " + vueExports.toDisplayString(row.amount), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_table_column, {
                    prop: "status",
                    label: "状态",
                    "min-width": "90"
                  }, {
                    default: vueExports.withCtx(({ row }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_tag, {
                          type: row.status.includes("待") ? "warning" : row.status.includes("发") ? "info" : "success"
                        }, {
                          default: vueExports.withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${serverRenderer_cjs_prodExports.ssrInterpolate(row.status)}`);
                            } else {
                              return [
                                vueExports.createTextVNode(vueExports.toDisplayString(row.status), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          vueExports.createVNode(_component_el_tag, {
                            type: row.status.includes("待") ? "warning" : row.status.includes("发") ? "info" : "success"
                          }, {
                            default: vueExports.withCtx(() => [
                              vueExports.createTextVNode(vueExports.toDisplayString(row.status), 1)
                            ]),
                            _: 2
                          }, 1032, ["type"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer_cjs_prodExports.ssrRenderComponent(_component_el_table_column, {
                    prop: "time",
                    label: "时间",
                    "min-width": "80"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vueExports.createVNode(_component_el_table_column, {
                      prop: "id",
                      label: "订单号",
                      "min-width": "160"
                    }),
                    vueExports.createVNode(_component_el_table_column, {
                      prop: "user",
                      label: "用户",
                      "min-width": "100"
                    }),
                    vueExports.createVNode(_component_el_table_column, {
                      prop: "amount",
                      label: "金额",
                      "min-width": "80"
                    }, {
                      default: vueExports.withCtx(({ row }) => [
                        vueExports.createTextVNode("¥ " + vueExports.toDisplayString(row.amount), 1)
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_el_table_column, {
                      prop: "status",
                      label: "状态",
                      "min-width": "90"
                    }, {
                      default: vueExports.withCtx(({ row }) => [
                        vueExports.createVNode(_component_el_tag, {
                          type: row.status.includes("待") ? "warning" : row.status.includes("发") ? "info" : "success"
                        }, {
                          default: vueExports.withCtx(() => [
                            vueExports.createTextVNode(vueExports.toDisplayString(row.status), 1)
                          ]),
                          _: 2
                        }, 1032, ["type"])
                      ]),
                      _: 1
                    }),
                    vueExports.createVNode(_component_el_table_column, {
                      prop: "time",
                      label: "时间",
                      "min-width": "80"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              vueExports.createVNode(_component_el_table, {
                size: "small",
                border: "",
                data: [
                  { id: "A20251016001", user: "Alice", amount: 1299, status: "已支付", time: "09:12" },
                  { id: "A20251016002", user: "Bob", amount: 289, status: "已发货", time: "09:18" },
                  { id: "A20251016003", user: "Cindy", amount: 569, status: "待支付", time: "09:22" },
                  { id: "A20251016004", user: "David", amount: 78, status: "已完成", time: "09:31" },
                  { id: "A20251016005", user: "Eve", amount: 2199, status: "已完成", time: "09:34" }
                ]
              }, {
                default: vueExports.withCtx(() => [
                  vueExports.createVNode(_component_el_table_column, {
                    prop: "id",
                    label: "订单号",
                    "min-width": "160"
                  }),
                  vueExports.createVNode(_component_el_table_column, {
                    prop: "user",
                    label: "用户",
                    "min-width": "100"
                  }),
                  vueExports.createVNode(_component_el_table_column, {
                    prop: "amount",
                    label: "金额",
                    "min-width": "80"
                  }, {
                    default: vueExports.withCtx(({ row }) => [
                      vueExports.createTextVNode("¥ " + vueExports.toDisplayString(row.amount), 1)
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_el_table_column, {
                    prop: "status",
                    label: "状态",
                    "min-width": "90"
                  }, {
                    default: vueExports.withCtx(({ row }) => [
                      vueExports.createVNode(_component_el_tag, {
                        type: row.status.includes("待") ? "warning" : row.status.includes("发") ? "info" : "success"
                      }, {
                        default: vueExports.withCtx(() => [
                          vueExports.createTextVNode(vueExports.toDisplayString(row.status), 1)
                        ]),
                        _: 2
                      }, 1032, ["type"])
                    ]),
                    _: 1
                  }),
                  vueExports.createVNode(_component_el_table_column, {
                    prop: "time",
                    label: "时间",
                    "min-width": "80"
                  })
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const home = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-94e61e2b"]]);

export { home as default };
//# sourceMappingURL=home-Cv2qUYZ9.mjs.map
