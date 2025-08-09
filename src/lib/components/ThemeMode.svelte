<script lang="ts">
  import { onMount } from "svelte";

  let lightMode: boolean = true;

  onMount(() => {
    document.documentElement.classList.add("no-transition");
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      lightMode = false;
      document.documentElement.classList.add("dark");
    } else {
      lightMode = true;
      document.documentElement.classList.remove("dark");
    }

    setTimeout(() => {
      document.documentElement.classList.remove("no-transition");
    }, 50);
  });

  const clicked = () => {
    lightMode = !lightMode;

    if (lightMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };
</script>

<button onclick={clicked} class="bg-white dark:bg-gray-900 px-2.5 py-2.5">
  {#if lightMode}
    <svg
      class="w-6 h-6 items-justify-center items-center"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        fill-rule="evenodd"
        d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
        clip-rule="evenodd"
      />
    </svg>
  {:else}
    <svg
      class="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M21 12.79A9 9 0 0 1 12.21 3a1 1 0 0 0-1.21 1.21A7 7 0 1 0 20.79 14a1 1 0 0 0 .21-1.21z"
      />
    </svg>
  {/if}
</button>
