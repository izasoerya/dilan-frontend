<script lang="ts">
  import "./app.css";
  import ThemeMode from "./lib/components/ThemeMode.svelte";
  import NodeStatus from "./lib/components/NodeStatus.svelte";
  import type { NodeProperty } from "./lib/models/NodeProperty";
  import Map from "./lib/components/Map.svelte";
  import supabase from "./services/SupabaseClient";
  import { onMount } from "svelte";
  import type { MedicineProperty } from "./lib/models/MedicineProperty";
  import MedicineContainer from "./lib/components/MedicineContainer.svelte";

  let nodeData: NodeProperty[] = [];
  let selectedNodeProperty: NodeProperty;
  let medicineData: MedicineProperty[] = [];

  onMount(async () => {
    const { data: NodeData } = await supabase.from("node_prop").select();
    nodeData = (NodeData ?? []).map((item) => ({
      ...item,
      created_at: item.created_at ? new Date(item.created_at) : null,
      updated_at: item.updated_at ? new Date(item.updated_at) : null,
    }));
    selectedNodeProperty = nodeData[0];

    const { data: MedicineData } = await supabase
      .from("medicine_prop")
      .select()
      .eq("esp_owner", selectedNodeProperty.esp_owner);
    const parseAlarmTime = (
      alarmTimeObj: Record<string, boolean> | null | undefined
    ): [string, boolean][] => {
      return alarmTimeObj ? Object.entries(alarmTimeObj) : [];
    };

    medicineData = (MedicineData ?? []).map((item) => ({
      ...item,
      alarm_time: parseAlarmTime(item.alarm_time),
      updated_at: item.updated_at ? new Date(item.updated_at) : undefined,
    }));
  });

  function handleTrackerChange(event: CustomEvent<string>) {
    const newId = event.detail;
    const found = nodeData.find((t) => t.id === newId);
    if (found) {
      selectedNodeProperty = found;
    }
  }

  // Debug
  $: console.log("init nodeData: ", nodeData);
  $: console.log("init medicineData: ", medicineData);
  $: console.log("selectedNodeProperty changed:", selectedNodeProperty);
</script>

<main>
  <div
    class="bg-white dark:bg-gray-800 dark:text-white
    sticky top-0 z-[401] w-full shadow-md
    flex flex-row items-center justify-between px-10 py-1.5
    transition-colors duration-300"
  >
    <h1 class="text-2xl font-bold m-0">DILAN</h1>
    <ThemeMode />
  </div>
  {#if nodeData[0] && medicineData[0]}
    <div class="card flex flex-col md:flex-row gap-5">
      <div class="md:flex-[2.3]">
        <Map
          trackers={nodeData}
          selectedTrackerIds={selectedNodeProperty.id!}
        />
      </div>
      <div class="md:flex-1">
        <NodeStatus
          trackers={nodeData}
          selectedTracker={selectedNodeProperty}
          on:trackerChange={handleTrackerChange}
        />
      </div>
    </div>
    <div>
      <MedicineContainer medicine={medicineData[0]} />
    </div>
  {:else}
    <div class="card p-8 text-center text-gray-500">Loading nodeData...</div>
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
    width: 100%;
    background-color: #f9fafb;
    transition: background-color 0.3s ease;
    margin: 0;
    padding: 0;
  }

  :global(.dark) main {
    background-color: #111827;
  }

  :global(#app) {
    width: 100%;
  }
</style>
