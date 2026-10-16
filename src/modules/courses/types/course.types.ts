import type { BaseEntity } from "@shared/types";

export type CourseType = "Course" | "Document" | "Combo";
export type CourseStatus = "Draft" | "Published" | "Hidden";

export interface CourseCategory extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  display_order?: number;
}

export interface CourseFAQ {
  question: string;
  answer: string;
}

export interface Course extends BaseEntity {
  title: string;
  slug: string;
  type: CourseType;
  price: number;
  original_price?: number;
  description?: string;
  thumbnail?: string;
  resource_link: string; // BR-02: CMS only, hidden from public API
  status: CourseStatus;
  faqs?: CourseFAQ[];
  category_id?: string;
  category?: CourseCategory;
  seo_title?: string;
  seo_description?: string;
}

export interface CreateCourseDto {
  title: string;
  slug: string;
  type: CourseType;
  price: number;
  original_price?: number;
  description?: string;
  thumbnail?: string;
  resource_link: string;
  status: CourseStatus;
  category_id?: string;
  seo_title?: string;
  seo_description?: string;
}
