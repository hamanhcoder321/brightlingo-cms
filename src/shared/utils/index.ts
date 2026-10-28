import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  currency: string = "VND",
  locale: string = "vi-VN",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    expires +
    "; path=/";
}

export function getCookie(name: string): string {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1] || "") : r;
  }, "");
}

export function deleteCookie(name: string) {
  setCookie(name, "", -1);
}

export function getErrorMessage(
  error: any,
  defaultMessage: string = "Đã có lỗi xảy ra",
): string {
  if (typeof error === "string") return error;

  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    defaultMessage
  );
}

const DEV_FRONTEND_URL = "http://localhost:3000";
const PROD_FRONTEND_URL = "https://brightlingo-fe.vercel.app";

/**
 * URL website khách hàng (VITE_FRONTEND_URL), dùng cho nút "Xem trang", preview và copy link.
 * Chỉ dùng localhost khi chạy dev; bản build production thiếu biến sẽ cảnh báo trong console.
 */
export function getFrontendUrl(): string {
  const raw = (import.meta.env.VITE_FRONTEND_URL || "").trim().replace(/\/+$/, "");
  if (raw) return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  if (import.meta.env.PROD) {
    return PROD_FRONTEND_URL;
  }
  return DEV_FRONTEND_URL;
}

export function getFrontendPageUrl(path = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getFrontendUrl()}${cleanPath}`;
}
