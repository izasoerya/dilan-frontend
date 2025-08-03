<script lang="ts">
  // filepath: src/App.svelte
  import "./app.css";
  import ThemeMode from "./lib/components/ThemeMode.svelte";
  import NodeStatus from "./lib/components/NodeStatus.svelte";
  import type { NodeProperty } from "./lib/models/NodeProperty";
  import Map from "./lib/components/Map.svelte";
  import supabase from "./services/SupabaseClient";
  import { onMount } from "svelte";

  let data: NodeProperty[] = [];
  let error: any = null;
  let selectedNodeProperty: NodeProperty;

  onMount(async () => {
    const { data: result, error: err } = await supabase
      .from("node_prop")
      .select();

    data = (result ?? []).map((item) => ({
      ...item,
      created_at: item.created_at ? new Date(item.created_at) : null,
      updated_at: item.updated_at ? new Date(item.updated_at) : null,
    }));
    error = err;
    selectedNodeProperty = data[0];
  });

  // Listen for trackerChange event from NodeStatus
  function handleTrackerChange(event: CustomEvent<string>) {
    const newId = event.detail;
    const found = data.find((t) => t.id === newId);
    if (found) {
      selectedNodeProperty = found;
    }
  }

  // Debug
  $: console.log("init data: ", data);
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
  {#if data[0]}
    <div class="card flex flex-col md:flex-row gap-5">
      <div class="md:flex-[2.3]">
        <Map trackers={data} selectedTrackerIds={selectedNodeProperty.id!} />
      </div>
      <div class="md:flex-1">
        <NodeStatus
          trackers={data}
          selectedTracker={selectedNodeProperty}
          on:trackerChange={handleTrackerChange}
        />
      </div>
    </div>
  {:else}
    <div class="card p-8 text-center text-gray-500">Loading data...</div>
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
