import { createClient } from "@supabase/supabase-js";
import type { MedicineProperty } from "../lib/models/MedicineProperty";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export function subscribeToTable(
  table: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`${table}_changes`)
    .on("postgres_changes", { event: "*", schema: "public", table }, callback)
    .subscribe();
}

export async function initNodeData() {
  const { data: listESP } = await supabase
    .from("esp_client")
    .select("id")
    .eq("user_owner", "8fe5ae0f-6d92-4c8d-88a7-f86cb205aef5");
  const espOwners = (listESP ?? []).map((e) => e.id).filter(Boolean);
  const { data: NodeData } = await supabase
    .from("node_prop")
    .select()
    .in("esp_owner", espOwners);
  const nodeData = (NodeData ?? []).map((item) => ({
    ...item,
    created_at: item.created_at ? new Date(item.created_at) : null,
    updated_at: item.updated_at ? new Date(item.updated_at) : null,
  }));
  return nodeData;
}

export async function initMedicineData(esp_owner: string) {
  const { data: MedicineData } = await supabase
    .from("medicine_prop")
    .select()
    .eq("esp_owner", esp_owner);

  const medicineIds = (MedicineData ?? []).map((item) => item.id);

  const { data: MedicineStatus } = await supabase
    .from("medicine_status")
    .select()
    .in("medicine_id", medicineIds);

  const medicineData = (MedicineData ?? []).map((item) => ({
    ...item,
    medicine_status: (MedicineStatus ?? [])
      .filter((status) => status.medicine_id === item.id)
      .map((status) => ({
        ...status,
        alarm_time:
          typeof status.alarm_time === "string"
            ? status.alarm_time.replace(/\s*\+\d{2}$/, "")
            : status.alarm_time,
      })),
    updated_at: item.updated_at ? new Date(item.updated_at) : undefined,
  }));

  return medicineData;
}

export async function createMedicineData(createdMedicine: MedicineProperty) {
  const { data: MedicinePropData } = await supabase
    .from("medicine_prop")
    .insert({
      name: createdMedicine.name,
      category: createdMedicine.category,
      description: createdMedicine.description,
      qty: createdMedicine.qty,
      esp_owner: createdMedicine.esp_owner,
    })
    .select()
    .single();
  console.log(MedicinePropData);

  // Insert one medicine_status row for each alarm time
  if (MedicinePropData && Array.isArray(createdMedicine.medicine_status)) {
    const statusRows = createdMedicine.medicine_status.map((status) => ({
      medicine_id: MedicinePropData.id,
      alarm_time: status.alarm_time,
      is_taken: false,
    }));

    await supabase.from("medicine_status").insert(statusRows);
  }
  location.reload();
}

export default supabase;
