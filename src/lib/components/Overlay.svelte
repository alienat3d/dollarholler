<script lang="ts">
  import { fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let className: string = '';
</script>

<svelte:head>
  <style lang="postcss">
    body {
      @apply overflow-hidden;
    }
  </style>
</svelte:head>

<div
  class={`fixed inset-0 z-overlay bg-blueGem opacity-60 ${className}`}
  transition:fade={{ duration: 300, easing: cubicOut }}
/>
