import type { RouteRecordRaw } from "vue-router";
import { MainLayout } from "@app/layouts";

export const emailTemplateRoutes: RouteRecordRaw[] = [
  {
    path: "/email-templates",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "email-templates",
        component: () => import("../pages/EmailTemplateListPage.vue"),
        meta: {
          title: "Quản lý Email Templates",
          requiresAuth: true,
        },
      },
      {
        path: ":id",
        name: "email-template-edit",
        component: () => import("../pages/EmailTemplateEditPage.vue"),
        meta: {
          title: "Chỉnh sửa Email Template",
          requiresAuth: true,
        },
      },
    ],
  },
];
