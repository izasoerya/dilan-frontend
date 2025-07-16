export interface NodeProperty {
  id: string | null;
  latitude: number;
  longitude: number;
  battery: number;
  esp_owner: string;
  is_medicine_taken: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}
