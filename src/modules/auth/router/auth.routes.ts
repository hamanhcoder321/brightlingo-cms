import type { RouteRecordRaw } from "vue-router";
import { AuthLayout } from "@app/layouts";

export const authRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "login",
        component: () => import("../pages/LoginPage.vue"),
        meta: {
          title: "Đăng nhập Quản trị viên",
          requiresAuth: false,
        },
      },
    ],
  },
];
