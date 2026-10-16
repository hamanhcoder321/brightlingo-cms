import dayjs from "dayjs";

export function formatDate(date: string | Date | null | undefined, format: string = "DD/MM/YYYY"): string {
  if (!date) return "-";
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date | null | undefined, format: string = "DD/MM/YYYY HH:mm"): string {
  if (!date) return "-";
  return dayjs(date).format(format);
}
