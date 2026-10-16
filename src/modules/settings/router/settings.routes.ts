import type { RouteRecordRaw } from "vue-router";
import { MainLayout } from "@app/layouts";

export const settingsRoutes: RouteRecordRaw[] = [
  {
    path: "/settings",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "settings",
        component: () => import("../pages/SettingsPage.vue"),
        meta: {
          title: "Cài đặt Hệ thống & Thanh toán",
          requiresAuth: true,
        },
      },
    ],
  },
];
