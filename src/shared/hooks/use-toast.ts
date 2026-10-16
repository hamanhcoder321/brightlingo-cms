import { inject } from "vue";

export function useToast() {
  const toast = inject("toast") as {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  };

  if (!toast) {
    throw new Error(
      "useToast must be used within a component wrapped by ToastContainer",
    );
  }

  return { toast };
}
