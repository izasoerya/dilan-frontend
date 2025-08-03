<script lang="ts">
  // filepath: src/lib/components/NodeStatus.svelte
  import type { NodeProperty } from "../models/NodeProperty";
  import { createEventDispatcher, afterUpdate } from "svelte";

  export let trackers: NodeProperty[] = [];
  export let selectedTracker: NodeProperty;

  let selectedTrackerId: string;
  const dispatch = createEventDispatcher();
  $: selectedTrackerId = selectedTracker?.id!;

  function formatDate(date: Date | null): string {
    if (!date) return "Unknown";
    return new Date(date).toLocaleString();
  }

  function getOnlineStatus(updatedAt: Date | null): {
    text: string;
    class: string;
  } {
    if (!updatedAt) return { text: "Unknown", class: "text-gray-500" };

    const now = new Date();
    const lastUpdate = new Date(updatedAt);
    const timeDiff = now.getTime() - lastUpdate.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    if (minutesDiff < 5) {
      return { text: "Online", class: "text-green-600 font-bold" };
    } else if (minutesDiff < 30) {
      return { text: "Recently Online", class: "text-yellow-600 font-bold" };
    } else {
      return { text: "Offline", class: "text-red-600 font-bold" };
    }
  }
  $: onlineStatus = getOnlineStatus(selectedTracker?.updated_at);

  function changeTracker(newId: string) {
    dispatch("trackerChange", newId);
  }
</script>

<div
  class="rounded-xl shadow-md bg-white dark:bg-gray-800 transition-colors duration-300"
>
  <h2 class="text-lg font-bold mb-2 dark:text-white">Node Status</h2>

  <select
    bind:value={selectedTrackerId}
    on:change={() => changeTracker(selectedTrackerId)}
    class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
  >
    {#each trackers as tracker}
      <option value={tracker.id}>
        {tracker.esp_owner || "Unknown"} - {tracker.id}
      </option>
    {/each}
  </select>

  <div class="mt-4 text-sm dark:text-gray-300 flex flex-col gap-1.5">
    <p class="flex justify-between">
      <span>Latitude:</span>
      <span>{selectedTracker?.latitude ?? "N/A"}</span>
    </p>
    <p class="flex justify-between">
      <span>Longitude:</span>
      <span>{selectedTracker?.longitude ?? "N/A"}</span>
    </p>
    <p class="flex justify-between">
      <span>Battery:</span>
      <span>
        {selectedTracker?.battery}
        {selectedTracker?.battery !== null ? "%" : ""}
      </span>
    </p>
    <p class="flex justify-between">
      <span>Still Online:</span>
      <span class={onlineStatus.class}>{onlineStatus.text}</span>
    </p>
    <p class="flex justify-between text-gray-400 dark:text-gray-500">
      <span>Last Update:</span>
      <span>{formatDate(selectedTracker?.updated_at)}</span>
    </p>
  </div>
</div>
