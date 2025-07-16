<script lang="ts">
  import type { NodeProperty } from "../models/NodeProperty";

  export let tracker: NodeProperty;
  let selectedTrackerId = tracker.id;
  const availableTrackers: NodeProperty[] = [tracker];

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

  $: onlineStatus = getOnlineStatus(tracker.updated_at);
</script>

<div
  class="rounded-xl shadow p-4 bg-white dark:bg-gray-800 transition-colors duration-300"
>
  <h2 class="text-lg font-bold mb-2 dark:text-white">Node Status</h2>

  <select
    bind:value={selectedTrackerId}
    class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
  >
    {#each availableTrackers as availableTracker}
      <option value={availableTracker.id}>
        {availableTracker.esp_owner || "Unknown"} - {availableTracker.id}
      </option>
    {/each}
  </select>

  <div class="mt-4 text-sm dark:text-gray-300 flex flex-col gap-1.5">
    <p class="flex justify-between">
      <span>Latitude:</span>
      <span>{tracker.latitude ?? "N/A"}</span>
    </p>
    <p class="flex justify-between">
      <span>Longitude:</span>
      <span>{tracker.longitude ?? "N/A"}</span>
    </p>
    <p class="flex justify-between">
      <span>Battery:</span>
      <span>{tracker.battery}{tracker.battery !== null ? "%" : ""}</span>
    </p>
    <p class="flex justify-between">
      <span>Still Online:</span>
      <span class={onlineStatus.class}>{onlineStatus.text}</span>
    </p>
    <p class="flex justify-between text-gray-400 dark:text-gray-500">
      <span>Last Update:</span>
      <span>{formatDate(tracker.updated_at)}</span>
    </p>
  </div>
</div>
