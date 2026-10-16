import { apiService } from "@shared/services";
import type { Course, CourseCategory, CreateCourseDto } from "../types/course.types";

export const courseApi = {
  getCourses: async (params?: any): Promise<{ items: Course[]; total: number }> => {
    try {
      const res = await apiService.get("/courses", { params });
      return {
        items: Array.isArray(res.data) ? res.data : (res.data?.items || []),
        total: res.data?.total || (Array.isArray(res.data) ? res.data.length : 0),
      };
    } catch {
      return { items: [], total: 0 };
    }
  },

  getCourseById: async (id: string): Promise<Course> => {
    const res = await apiService.get(`/courses/${id}`);
    return res.data;
  },

  createCourse: async (data: CreateCourseDto): Promise<Course> => {
    const res = await apiService.post("/courses", data);
    return res.data;
  },

  updateCourse: async (id: string, data: Partial<CreateCourseDto>): Promise<Course> => {
    const res = await apiService.put(`/courses/${id}`, data);
    return res.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await apiService.delete(`/courses/${id}`);
  },

  getCategories: async (): Promise<CourseCategory[]> => {
    try {
      const res = await apiService.get("/categories");
      return Array.isArray(res.data) ? res.data : (res.data?.items || []);
    } catch {
      return [];
    }
  },

  createCategory: async (data: { name: string; slug: string; description?: string }): Promise<CourseCategory> => {
    const res = await apiService.post("/categories", data);
    return res.data;
  },
};
