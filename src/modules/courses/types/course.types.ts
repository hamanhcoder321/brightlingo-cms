export type CourseType = "Course" | "Document" | "Combo";
export type CourseStatus = "Draft" | "Published" | "Hidden" | "DRAFT" | "PUBLISHED" | "HIDDEN";

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CourseBenefit {
  id?: string;
  title: string;
  description?: string;
}

export interface CourseLesson {
  id?: string;
  title: string;
  type: "Video" | "PDF" | "Audio" | string;
  duration?: string;
}

export interface CourseSection {
  id?: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseCurriculum {
  summary?: string;
  totalDuration?: string;
  sections?: CourseSection[];
}

export interface CourseFAQ {
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  title: string;
  name?: string;
  slug: string;
  type?: CourseType;
  price: number;
  original_price?: number;
  originalPrice?: number;
  discount_percent?: number;
  discountPercent?: number;
  description?: string;
  tag_badge?: string;
  tagBadge?: string;
  type_badge?: string;
  typeBadge?: string;
  duration?: string;
  image?: string;
  thumbnail?: string;
  video_url?: string;
  videoUrl?: string;
  resource_link?: string;
  resourceLink?: string;
  status: CourseStatus | string;
  views_count?: number;
  viewsCount?: number;
  buyers_count?: number;
  buyersCount?: number;
  realRevenue?: number;
  real_revenue?: number;
  students_count?: string;
  studentsCount?: string;
  isFeatured?: boolean;
  category_id?: string;
  categoryId?: string;
  category_name?: string;
  categoryName?: string;
  benefits?: CourseBenefit[];
  curriculum?: CourseCurriculum;
  faqs?: CourseFAQ[];
  seo_title?: string;
  seoTitle?: string;
  seo_description?: string;
  seoDescription?: string;
  og_image?: string;
  ogImage?: string;
  emailSubject?: string;
  emailBody?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCourseDto {
  title: string;
  slug: string;
  type?: CourseType;
  price: number;
  original_price?: number;
  originalPrice?: number;
  description?: string;
  tag_badge?: string;
  tagBadge?: string;
  type_badge?: string;
  typeBadge?: string;
  duration?: string;
  thumbnail?: string;
  image?: string;
  video_url?: string;
  videoUrl?: string;
  resource_link?: string;
  resourceLink?: string;
  status?: CourseStatus | string;
  category_id?: string;
  categoryId?: string;
  category_name?: string;
  categoryName?: string;
  seo_title?: string;
  seoTitle?: string;
  seo_description?: string;
  seoDescription?: string;
  og_image?: string;
  ogImage?: string;
  benefits?: CourseBenefit[];
  curriculum?: CourseCurriculum;
  faqs?: CourseFAQ[];
  isFeatured?: boolean;
}
