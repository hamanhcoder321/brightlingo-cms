import type { RouteRecordRaw } from "vue-router";
import { MainLayout } from "@app/layouts";

export const settingsRoutes: RouteRecordRaw[] = [
  {
    path: "/settings",
    alias: ["/banners"],
    component: MainLayout,
    children: [
      {
        path: "",
        name: "settings",
        component: () => import("../pages/SettingsPage.vue"),
        meta: {
          title: "Giao diện & Banner",
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/seo",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "seo-google",
        component: () => import("../pages/SeoGooglePage.vue"),
        meta: {
          title: "SEO & Google",
          requiresAuth: true,
        },
      },
    ],
  },
];
