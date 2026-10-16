import type { RouteRecordRaw } from "vue-router";
import { MainLayout } from "@app/layouts";

export const orderRoutes: RouteRecordRaw[] = [
  {
    path: "/orders",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "orders",
        component: () => import("../pages/OrderListPage.vue"),
        meta: {
          title: "Quản lý Đơn hàng & Giao tài liệu",
          requiresAuth: true,
        },
      },
    ],
  },
];
