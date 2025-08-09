export interface MedicineStatus {
  id: string | undefined;
  medicine_id: string;
  alarm_time: string; // e.g., "08:00:00+07:00"
  is_taken: string;
  updated_at: Date | undefined;
}
