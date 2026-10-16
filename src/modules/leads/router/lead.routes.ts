import type { RouteRecordRaw } from "vue-router";
import { MainLayout } from "@app/layouts";

export const leadRoutes: RouteRecordRaw[] = [
  {
    path: "/leads",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "leads",
        component: () => import("../pages/LeadListPage.vue"),
        meta: {
          title: "Quản lý Tư vấn & Leads",
          requiresAuth: true,
        },
      },
    ],
  },
];
