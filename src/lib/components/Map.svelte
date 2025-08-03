<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { Map as LeafletMap, Marker } from "leaflet";
  import type { NodeProperty } from "../models/NodeProperty";

  export let trackers: NodeProperty[];
  export let selectedTrackerIds: string;
  $: selectedTracker = trackers.find((t) => t.id === selectedTrackerIds);

  let mapContainer: HTMLDivElement;
  let map: LeafletMap;
  let marker: Marker;

  onMount(async () => {
    const L = await import("leaflet");
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
    map = L.map(mapContainer, {
      center: [selectedTracker!.latitude ?? 0, selectedTracker!.longitude ?? 0],
      zoom: 13,
      scrollWheelZoom: true,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add marker if coordinates are available
    if (
      selectedTracker!.latitude !== null &&
      selectedTracker!.longitude !== null
    ) {
      marker = L.marker([
        selectedTracker!.latitude,
        selectedTracker!.longitude,
      ]).addTo(map);
      marker.bindPopup(`
        <b>${selectedTracker!.esp_owner || "Unknown Device"}</b><br>
        ID: ${selectedTracker!.id}<br>
        Battery: ${selectedTracker!.battery ?? "N/A"}%<br>
        Last Update: ${new Date(selectedTracker!.updated_at || new Date()).toLocaleString()}
      `);
    }
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });

  $: if (
    map &&
    marker &&
    selectedTracker!.latitude !== null &&
    selectedTracker!.longitude !== null
  ) {
    marker.setLatLng([selectedTracker!.latitude, selectedTracker!.longitude]);
    map.setView([selectedTracker!.latitude, selectedTracker!.longitude], 13);
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  />
</svelte:head>

<div
  class="rounded-xl shadow-md bg-white dark:bg-gray-800 transition-colors duration-300"
>
  <h2 class="text-lg font-bold dark:text-white">Device Location</h2>

  <div class="mb-2">
    <div class="flex justify-between items-center text-sm dark:text-gray-300">
      <span>Device: {selectedTracker!.esp_owner || "Unknown"}</span>
      <span class="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
        ID: {selectedTracker!.id}
      </span>
    </div>
  </div>

  <div
    bind:this={mapContainer}
    class="w-full h-64 rounded-lg border border-gray-200 dark:border-gray-600"
  ></div>

  <div class="mt-2 text-sm dark:text-gray-300">
    <p class="text-gray-400 dark:text-gray-500 text-xs">
      Last Update: {selectedTracker!.updated_at
        ? new Date(selectedTracker!.updated_at).toLocaleString()
        : "Unknown"}
    </p>
  </div>
</div>

<style>
  :global(.leaflet-control-container) {
    filter: brightness(0.9);
  }

  :global(.dark .leaflet-control-container) {
    filter: brightness(1.2) contrast(0.8);
  }
</style>
