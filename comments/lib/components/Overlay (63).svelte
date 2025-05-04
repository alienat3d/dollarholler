<script lang="ts">
  import { fade } from 'svelte/transition';
  import { elasticInOut } from 'svelte/easing';

  export let className: string = '';
</script>

<svelte:head>
  <style lang="postcss">
    body {
      @apply overflow-hidden;
    }
  </style>
</svelte:head>

<!-- 63.1 Всё выглядит здорово за исключением подкладки, которая включается и выключается всё ещё резко. Исправим это. И тут нам уже подойдёт другая анимация угасания\появления от Svelte "fade". -->
<div
  class={`fixed inset-0 z-overlay bg-blueGem opacity-60 ${className}`}
  transition:fade={{ duration: 500, easing: elasticInOut }}
/>
