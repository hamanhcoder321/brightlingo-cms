import type { RouteRecordRaw } from "vue-router";
import { MainLayout } from "@app/layouts";

export const couponRoutes: RouteRecordRaw[] = [
  {
    path: "/coupons",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "coupons",
        component: () => import("../pages/CouponListPage.vue"),
        meta: {
          title: "Quản lý Mã giảm giá",
          requiresAuth: true,
        },
      },
    ],
  },
];
