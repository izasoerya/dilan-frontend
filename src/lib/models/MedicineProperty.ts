import type { MedicineStatus } from "./MedicineStatus";

export interface MedicineProperty {
  id: string | undefined;
  name: string;
  qty: number;
  category: string;
  description: string;
  medicine_status: [MedicineStatus];
  updated_at: Date | undefined;
  user_owner: string | undefined;
  esp_owner: string | undefined;
}
