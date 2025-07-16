<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { Map as LeafletMap, Marker } from "leaflet";
  import type { NodeProperty } from "../models/NodeProperty";

  export let tracker: NodeProperty;

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
      center: [tracker.latitude ?? 0, tracker.longitude ?? 0],
      zoom: 13,
      scrollWheelZoom: true,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add marker if coordinates are available
    if (tracker.latitude !== null && tracker.longitude !== null) {
      marker = L.marker([tracker.latitude, tracker.longitude]).addTo(map);
      marker.bindPopup(`
        <b>${tracker.esp_owner || "Unknown Device"}</b><br>
        ID: ${tracker.id}<br>
        Battery: ${tracker.battery ?? "N/A"}%<br>
        Last Update: ${new Date(tracker.updated_at || new Date()).toLocaleString()}
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
    tracker.latitude !== null &&
    tracker.longitude !== null
  ) {
    marker.setLatLng([tracker.latitude, tracker.longitude]);
    map.setView([tracker.latitude, tracker.longitude], 13);
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
      <span>Device: {tracker.esp_owner || "Unknown"}</span>
      <span class="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
        ID: {tracker.id}
      </span>
    </div>
  </div>

  <div
    bind:this={mapContainer}
    class="w-full h-64 rounded-lg border border-gray-200 dark:border-gray-600"
  ></div>

  <div class="mt-2 text-sm dark:text-gray-300">
    <p class="text-gray-400 dark:text-gray-500 text-xs">
      Last Update: {tracker.updated_at
        ? new Date(tracker.updated_at).toLocaleString()
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
