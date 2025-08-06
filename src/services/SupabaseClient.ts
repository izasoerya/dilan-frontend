import { createClient } from "@supabase/supabase-js";

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
  const parseAlarmTime = (
    alarmTimeObj: Record<string, boolean> | null | undefined
  ): [string, boolean][] => {
    return alarmTimeObj ? Object.entries(alarmTimeObj) : [];
  };

  const medicineData = (MedicineData ?? []).map((item) => ({
    ...item,
    alarm_time: parseAlarmTime(item.alarm_time),
    updated_at: item.updated_at ? new Date(item.updated_at) : undefined,
  }));

  return medicineData;
}

export default supabase;
