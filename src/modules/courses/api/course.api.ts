import { apiService } from "@shared/services";
import type { Course, CourseCategory } from "../types/course.types";

const fallbackCourses: Course[] = [
  {
    id: "c1",
    title: "Mẹ dạy con tiếng Anh tại nhà",
    slug: "me-day-con-tieng-anh",
    price: 399000,
    originalPrice: 699000,
    status: "PUBLISHED",
    buyersCount: 38,
    viewsCount: 3420,
    isFeatured: true,
    tagBadge: "32 video · 6 PDF · Audio",
    duration: "9 giờ",
    description: "Lộ trình 8 tuần, mỗi ngày 15 phút: bố mẹ – kể cả khi không giỏi tiếng Anh – vẫn tự tin trò chuyện tiếng Anh cùng con 4–10 tuổi.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    resourceLink: "https://drive.google.com/drive/folders/tai-lieu-me-day-con-brightlingo",
    seoTitle: "Mẹ dạy con tiếng Anh tại nhà – Video & PDF | EngNest",
    seoDescription: "Lộ trình 8 tuần cho bố mẹ không giỏi tiếng Anh vẫn dạy con 4–10 tuổi. Mua 1 lần học trọn đời, thanh toán QR, nhận link qua email ngay.",
    benefits: [
      { id: "b1", title: "Nói tiếng Anh cùng con mỗi ngày", description: "" },
      { id: "b2", title: "Phát âm đủ chuẩn để dạy con", description: "" },
    ],
    curriculum: {
      summary: "32 video · 6 PDF · Audio",
      sections: [
        {
          id: "s1",
          title: "Phần 1 · Mẹ chuẩn bị: phát âm & 100 câu nền tảng",
          lessons: [
            { id: "l1", title: "Bài 1: Vì sao mẹ không cần giỏi vẫn dạy được con", type: "Video", duration: "12:40" },
          ],
        },
        {
          id: "s2",
          title: "Phần 2 · Tiếng Anh trong sinh hoạt hằng ngày",
          lessons: [
            { id: "l2", title: "Bài 2: Chào buổi sáng & Đánh răng cùng bé", type: "Video", duration: "10:15" },
          ],
        },
      ],
    },
    faqs: [
      { question: "Con tôi 3 tuổi học được không?", answer: "Được bạn nhé, lộ trình áp dụng rất tốt từ 3-10 tuổi." },
    ],
  },
  {
    id: "c2",
    title: "1.000 câu tiếng Anh mẹ nói với con mỗi ngày",
    slug: "1000-cau-me-noi-voi-con",
    price: 199000,
    originalPrice: 399000,
    status: "PUBLISHED",
    buyersCount: 9,
    viewsCount: 1180,
    isFeatured: false,
    tagBadge: "Ebook PDF & 100 Audio",
    duration: "5 giờ",
    description: "Bộ tuyển tập 1.000 câu giao tiếp thực chiến mẹ nói với bé từ sáng đến tối.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    resourceLink: "https://drive.google.com/drive/folders/1000-cau-me-noi-con",
    seoTitle: "1.000 câu tiếng Anh mẹ nói với con mỗi ngày | EngNest",
    seoDescription: "Bộ tuyển tập 1.000 câu giao tiếp thực chiến chuẩn bản xứ.",
  },
];

export const courseApi = {
  getCourses: async (params?: any): Promise<{ items: Course[]; total: number }> => {
    try {
      const res = await apiService.get("/courses", { params });
      let data = res.data;
      if (data && data.data && Array.isArray(data.data)) {
        data = data.data;
      }
      if (Array.isArray(data)) {
        return {
          items: data.map((item: any) => ({
            ...item,
            title: item.title || item.name,
            buyersCount: item.buyersCount ?? item.buyers_count ?? 0,
            viewsCount: item.viewsCount ?? item.views_count ?? 0,
            status: item.status || "PUBLISHED",
            isFeatured: Boolean(item.isFeatured ?? item.is_featured),
          })),
          total: data.length,
        };
      }
      if (data && Array.isArray(data.items)) {
        return {
          items: data.items.map((item: any) => ({
            ...item,
            isFeatured: Boolean(item.isFeatured ?? item.is_featured),
          })),
          total: data.total || data.items.length,
        };
      }
      return { items: fallbackCourses, total: fallbackCourses.length };
    } catch (error) {
      console.warn("Unable to fetch courses from API, using fallback prototype data:", error);
      return { items: fallbackCourses, total: fallbackCourses.length };
    }
  },

  getCourseById: async (id: string): Promise<Course> => {
    try {
      const res = await apiService.get(`/courses/${id}`);
      let data = res.data;
      if (data && data.data) data = data.data;
      return {
        ...data,
        title: data.title || data.name,
        resourceLink: data.resourceLink || data.resource_link || "",
        seoTitle: data.seoTitle || data.seo_title || data.title,
        seoDescription: data.seoDescription || data.seo_description || data.tag_badge || "",
        tagBadge: data.tagBadge || data.tag_badge || "",
        duration: data.videoDemoDuration || data.duration || "9 giờ",
        isFeatured: Boolean(data.isFeatured ?? data.is_featured),
      };
    } catch {
      const found = fallbackCourses.find((c) => c.id === id || c.slug === id);
      if (found) return found;
      throw new Error("Course not found");
    }
  },

  setFeatured: async (id: string): Promise<Course> => {
    const res = await apiService.patch(`/courses/${id}/featured`);
    return res.data?.data || res.data;
  },

  createCourse: async (data: any): Promise<Course> => {
    const res = await apiService.post("/courses", data);
    return res.data?.data || res.data;
  },

  updateCourse: async (id: string, data: any): Promise<Course> => {
    const res = await apiService.put(`/courses/${id}`, data);
    return res.data?.data || res.data;
  },

  deleteCourse: async (id: string): Promise<any> => {
    const res = await apiService.delete(`/courses/${id}`);
    return res.data;
  },

  getCategories: async (): Promise<CourseCategory[]> => {
    try {
      const res = await apiService.get("/courses/categories");
      return Array.isArray(res.data) ? res.data : (res.data?.items || []);
    } catch {
      return [
        { id: "communication", name: "Giao tiếp thực tế", slug: "communication" },
        { id: "business", name: "Tiếng Anh công sở", slug: "business" },
        { id: "grammar-foundation", name: "Ngữ pháp & Nền tảng", slug: "grammar-foundation" },
        { id: "kids", name: "Mẹ dạy con", slug: "kids" },
      ];
    }
  },

  createCategory: async (data: { name: string; slug: string; description?: string }): Promise<CourseCategory> => {
    const res = await apiService.post("/categories", data);
    return res.data;
  },

  uploadVideo: async (file: File): Promise<{ success: boolean; url: string; filename: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiService.post("/upload/video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  uploadImage: async (file: File): Promise<{ success: boolean; url: string; filename: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiService.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
