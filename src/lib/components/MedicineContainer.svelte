<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { MedicineProperty } from "../models/MedicineProperty";

  export let medicine: MedicineProperty | undefined;
  const dispatch = createEventDispatcher<{ delete: string }>();

  let showMenu = false;
  let showDeleteModal = false;

  $: statuses = Array.isArray(medicine?.medicine_status)
    ? medicine.medicine_status
    : [];
  $: console.log("statuses:", statuses);

  function handleDelete() {
    showMenu = false;
    showDeleteModal = true;
  }

  function confirmDelete() {
    if (medicine?.id) {
      dispatch("delete", medicine.id);
    }
    showDeleteModal = false;
  }
</script>

{#if medicine}
  <div
    class="rounded-xl bg-white dark:bg-gray-800 shadow-md px-4 py-2
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
      <div class="flex items-center gap-2 absolute top-4 right-4">
        <span class="text-green-700 dark:text-green-400 text-sm font-medium"
          >{medicine.esp_owner}</span
        >
        <div class="relative">
          <button
            class="p-1 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
            on:click={() => (showMenu = !showMenu)}
            aria-label="More options"
            type="button"
          >
            <!-- Three dot icon -->
            <svg class="w-5 h-5" fill="red" viewBox="0 0 20 20">
              <circle cx="4" cy="10" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="16" cy="10" r="1.5" />
            </svg>
          </button>
          {#if showMenu}
            <div
              class="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow"
            >
              <button
                class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                on:click={handleDelete}
                type="button"
              >
                Delete
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
    <div class="mt-2 flex gap-2 text-sm">
      {#each statuses as status, i}
        <span
          class={status.is_taken
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"}
        >
          {status.alarm_time}
        </span>
      {/each}
    </div>
  </div>

  {#if showDeleteModal}
    <div
      class="fixed inset-0 z-502 flex items-center justify-center bg-black/40"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xs"
      >
        <div class="mb-4 text-center">
          <div
            class="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300"
          >
            Are you sure?
          </div>
          <div class="text-gray-700 dark:text-gray-300">
            Delete this medicine?
          </div>
        </div>
        <div class="flex justify-center gap-2">
          <button
            class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            on:click={() => (showDeleteModal = false)}
            type="button"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            on:click={confirmDelete}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  {/if}
{:else}
  <div class="mx-6 p-4 text-center text-gray-500 dark:text-gray-400">
    No medicine data available.
  </div>
{/if}

<style>
  /* Optionally add z-index for the menu/modal if needed */
</style>
