<script lang="ts">
  import "./app.css";
  import ThemeMode from "./lib/components/ThemeMode.svelte";
  import NodeStatus from "./lib/components/NodeStatus.svelte";
  import type { NodeProperty } from "./lib/models/NodeProperty";
  import Map from "./lib/components/Map.svelte";

  const sampleTracker: NodeProperty = {
    id: "001",
    latitude: 40.7128,
    longitude: -74.006,
    esp_owner: "Margaret Tracker",
    is_medicine_taken: true,
    battery: 85,
    created_at: new Date("2024-01-01"),
    updated_at: new Date(),
  };
</script>

<main>
  <div
    class="bg-white dark:bg-gray-800 dark:text-white
    sticky top-0 z-[401] w-full shadow-md
    flex flex-row items-center justify-between px-10 py-4
    transition-colors duration-300
    "
  >
    <h1 class="text-2xl font-bold m-0">DILAN</h1>
    <ThemeMode />
  </div>
  <div class="card flex flex-col md:flex-row gap-5">
    <div class="md:flex-[2.3]">
      <Map tracker={sampleTracker}></Map>
    </div>
    <div class="md:flex-1">
      <NodeStatus tracker={sampleTracker} />
    </div>
  </div>
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
