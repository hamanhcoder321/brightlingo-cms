import type { RouteRecordRaw } from "vue-router";
import { MainLayout } from "@app/layouts";

export const auditLogRoutes: RouteRecordRaw[] = [
  {
    path: "/audit-logs",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "audit-logs",
        component: () => import("../pages/AuditLogListPage.vue"),
        meta: {
          title: "Nhật ký Hoạt động (Audit Logs)",
          requiresAuth: true,
        },
      },
    ],
  },
];
