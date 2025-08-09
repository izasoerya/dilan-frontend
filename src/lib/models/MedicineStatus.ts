export interface MedicineStatus {
  id: string | undefined;
  medicine_id: string;
  alarm_time: number;
  is_taken: string;
  updated_at: Date | undefined;
}
