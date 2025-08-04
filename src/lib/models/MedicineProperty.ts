export interface MedicineProperty {
  id: string | undefined;
  name: string;
  qty: number;
  description: string;
  alarm_time: [string, boolean][]; // Array of [time, taken]
  updated_at: Date | undefined;
  user_owner: string | undefined;
  esp_owner: string | undefined;
}
