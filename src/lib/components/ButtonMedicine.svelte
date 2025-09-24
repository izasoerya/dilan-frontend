<script lang="ts">
  import { createEventDispatcher, tick } from "svelte";
  import type { MedicineProperty } from "../models/MedicineProperty";

  // --- Type Definition ---
  interface MedicineFormData {
    name: string;
    qty: number;
    category: string;
    description: string;
    times: string[];
  }

  // --- State ---
  const dispatch = createEventDispatcher<{ add: MedicineFormData }>();
  let showModal = false;
  let nameInput: HTMLInputElement;

  let formData: MedicineFormData;

  function getInitialFormData(): MedicineFormData {
    return {
      name: "",
      qty: 1,
      category: "tablet",
      description: "",
      times: ["08:00"],
    };
  }

  formData = getInitialFormData();
  $: console.log(formData.times);

  // --- Functions ---
  async function openModal() {
    formData = getInitialFormData();
    showModal = true;
    await tick();
    nameInput?.focus();
  }

  function closeModal() {
    showModal = false;
  }

  function addTimeField() {
    formData.times = [...formData.times, ""];
  }

  function removeTimeField(index: number) {
    formData.times = formData.times.filter((_, i) => i !== index);
  }

  function handleSubmit() {
    const finalTimes = [
      ...new Set(formData.times.filter((t) => t && t.trim() !== "")),
    ].sort();
    dispatch("add", {
      ...formData,
      times: finalTimes,
    });
    closeModal();
  }

  /**
   * This function now runs on every keydown, but only acts if the
   * modal is open and the key is 'Escape'.
   */
  function handleKeydown(event: KeyboardEvent) {
    if (showModal && event.key === "Escape") {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<button
  on:click={openModal}
  class="rounded-xl shadow-md bg-white dark:bg-gray-800 dark:text-white transition-colors duration-300 flex w-full h-12 items-center justify-center"
  type="button"
>
  <svg
    class="w-6 h-6 mr-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M8 8V5a4 4 0 1 1 8 0v3" />
    <line x1="12" y1="12" x2="12" y2="17" />
    <line x1="9" y1="14.5" x2="15" y2="14.5" />
  </svg>
  Add Medicine
</button>

{#if showModal}
  <div
    class="fixed inset-0 z-501 flex items-center justify-center bg-black/50 p-4"
    role="dialog"
    aria-modal="true"
    tabindex="0"
    on:click|self={closeModal}
    on:keydown={(e) => {
      if (e.key === "Escape") closeModal();
    }}
  >
    <div
      class="relative w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 flex flex-col max-h-[90vh]"
    >
      <div
        class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Add New Medicine
        </h3>
        <button
          on:click={closeModal}
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          type="button"
        >
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>

      <form class="p-4 overflow-y-auto" on:submit|preventDefault={handleSubmit}>
        <div class="grid gap-4 grid-cols-2">
          <div class="col-span-2">
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Name</label
            >
            <input
              type="text"
              id="name"
              bind:this={nameInput}
              bind:value={formData.name}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder="e.g., Paracetamol"
              required
            />
          </div>

          <div>
            <label
              for="qty"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Qty</label
            >
            <input
              type="number"
              id="qty"
              bind:value={formData.qty}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              min="1"
            />
          </div>

          <div>
            <label
              for="category"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Category</label
            >
            <input
              type="text"
              id="category"
              bind:value={formData.category}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder="e.g., Tablet, Miligram, etc."
            />
          </div>

          <!-- <div class="col-span-2">
            <label
              for="description"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Description</label
            >
            <textarea
              id="description"
              bind:value={formData.description}
              rows={3}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder="e.g., Take after meals"
            ></textarea>
          </div> -->
          <div class="col-span-2">
            <label
              for="time-0"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Times</label
            >
            {#each formData.times as time, i (i)}
              <div class="flex items-center gap-2 mb-2">
                <input
                  type="time"
                  id={"time-" + i}
                  bind:value={formData.times[i]}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  required
                />
                {#if formData.times.length > 1}
                  <button
                    type="button"
                    class="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    on:click={() => removeTimeField(i)}
                    aria-label="Remove time at index {i}"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path></svg
                    >
                  </button>
                {/if}
              </div>
            {/each}
            <button
              type="button"
              class="w-full text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
              on:click={addTimeField}
            >
              + Add Time
            </button>
          </div>
        </div>

        <div class="pt-4 mt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full"
          >
            Add Medicine
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
