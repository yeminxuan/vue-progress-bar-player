/*
 * @Author: 叶敏轩 mc20000406@163.com
 * @Date: 2022-10-19 21:23:35
 * @LastEditors: 叶敏轩 mc20000406@163.com
 * @LastEditTime: 2024-03-07 11:17:23
 * @FilePath: /vue3-process-bar-player/src/router/index.ts
 * @Description: 路由器统一管理
 */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Index from "@/components/common/layout/index.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Index,
    children: [
      {
        path: "home",
        components: {
          main: import("@views/home.vue"),
        },
      },
      {
        path: "overview",
        components: {
          main: () => import("@views/overview.vue"),
        },
      },

      {
        path: "progress-bar-player",
        components: {
          main: () => import("@views/colorSplitProgressBar.vue"),
        },
      },
    ],
    redirect: "/home",
    meta: { requireAuth: true },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
