<script lang="ts">
  import type { MedicineProperty } from "../models/MedicineProperty";

  export let medicine: MedicineProperty | undefined;
  $: alarmTimes = medicine?.alarm_time ?? [];
</script>

{#if medicine}
  <div
    class="rounded-xl bg-white dark:bg-gray-800 shadow-md p-4
    flex flex-col
    relative transition-colors duration-300 mx-6"
  >
    <div class="flex justify-between items-start">
      <div>
        <div class="font-semibold dark:text-white">
          {medicine.qty} Tablet | {medicine.name}
        </div>
        <div class="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
          {medicine.description}
        </div>
      </div>
      <div
        class="text-green-700 dark:text-green-400 text-sm font-medium absolute top-4 right-4"
      >
        {medicine.esp_owner}
      </div>
    </div>
    <div class="mt-2 flex gap-2 text-sm">
      {#each alarmTimes as [time, taken], i}
        <span
          class={i === 0
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"}
        >
          {time}
        </span>
      {/each}
    </div>
  </div>
{:else}
  <div class="mx-6 p-4 text-center text-gray-500 dark:text-gray-400">
    No medicine data available.
  </div>
{/if}

<style>
</style>
