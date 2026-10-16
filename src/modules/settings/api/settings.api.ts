import { apiService } from "@shared/services";
import type { SystemSettings } from "../types/settings.types";

export const settingsApi = {
  getSettings: async (): Promise<SystemSettings> => {
    try {
      const res = await apiService.get("/admin/settings");
      return res.data;
    } catch {
      return {
        site_name: "BrightLingo English",
        hotline: "1900 6868",
        support_email: "support@brightlingo.vn",
        vietqr_bank_code: "MB",
        vietqr_account_number: "090123456789",
        vietqr_account_name: "CONG TY TNHH BRIGHTLINGO",
      };
    }
  },

  updateSettings: async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
    const res = await apiService.put("/admin/settings", data);
    return res.data;
  },
};
