import type { RouteRecordRaw } from "vue-router";
import { MainLayout } from "@app/layouts";

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: "/dashboard",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("../pages/DashboardPage.vue"),
        meta: {
          title: "Tổng quan & Thống kê",
          requiresAuth: true,
        },
      },
    ],
  },
];
