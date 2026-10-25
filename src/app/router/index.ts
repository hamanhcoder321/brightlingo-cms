import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { STORAGE_KEYS } from "@shared/constants";
import { getCookie } from "@shared/utils";

import { authRoutes } from "@modules/auth";
import { dashboardRoutes } from "@modules/dashboard";
import { courseRoutes } from "@modules/courses";
import { orderRoutes } from "@modules/orders";
import { couponRoutes } from "@modules/coupons";
import { leadRoutes } from "@modules/leads";
import { settingsRoutes } from "@modules/settings";
import { auditLogRoutes } from "@modules/audit-logs";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  ...authRoutes,
  ...dashboardRoutes,
  ...courseRoutes,
  ...orderRoutes,
  ...couponRoutes,
  ...leadRoutes,
  {
    path: "/email-templates/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
  ...settingsRoutes,
  ...auditLogRoutes,
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@shared/components/NotFound.vue"),
    meta: {
      title: "Trang không tìm thấy",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  // Set document title
  if (to.meta?.title) {
    document.title = `${to.meta.title} - BrightLingo CMS`;
  } else {
    document.title = "BrightLingo CMS - Hệ thống Quản trị";
  }

  const token = getCookie(STORAGE_KEYS.ACCESS_TOKEN) || localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const requiresAuth = to.meta?.requiresAuth !== false;

  if (requiresAuth && !token) {
    next({ name: "login" });
  } else if (to.name === "login" && token) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
