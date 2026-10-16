import { apiService } from "@shared/services";
import type { LoginCredentials, LoginResponse, AdminUser } from "../types/auth.types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await apiService.post("/admin/login", credentials);
    return res.data;
  },

  getProfile: async (): Promise<AdminUser> => {
    const res = await apiService.get("/admin/profile");
    return res.data;
  },
};
