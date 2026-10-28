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
      {
        path: "bank-email",
        alias: ["/email-templates", "/payment-email"],
        name: "bank-email",
        component: () => import("../pages/BankEmailPage.vue"),
        meta: {
          title: "Ngân hàng & Email",
          requiresAuth: true,
        },
      },
      {
        path: "policy-faq",
        alias: ["/policy-faq", "/faq"],
        name: "policy-faq",
        component: () => import("../pages/PolicyFaqPage.vue"),
        meta: {
          title: "Chính sách & Hỏi đáp",
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
