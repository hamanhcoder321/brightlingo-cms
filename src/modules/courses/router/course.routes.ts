import type { RouteRecordRaw } from "vue-router";
import { MainLayout } from "@app/layouts";

export const courseRoutes: RouteRecordRaw[] = [
  {
    path: "/courses",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "courses",
        component: () => import("../pages/CourseListPage.vue"),
        meta: {
          title: "Quản lý Khóa học & Tài liệu",
          requiresAuth: true,
        },
      },
      {
        path: "create",
        name: "course-create",
        component: () => import("../pages/CourseFormPage.vue"),
        meta: {
          title: "Thêm Khóa học Mới",
          requiresAuth: true,
        },
      },
      {
        path: ":id/edit",
        name: "course-edit",
        component: () => import("../pages/CourseFormPage.vue"),
        meta: {
          title: "Chỉnh sửa Khóa học",
          requiresAuth: true,
        },
      },
      {
        path: "categories",
        name: "course-categories",
        component: () => import("../pages/CategoryListPage.vue"),
        meta: {
          title: "Danh mục Khóa học",
          requiresAuth: true,
        },
      },
    ],
  },
];
