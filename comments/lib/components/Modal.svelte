<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Cancel from './Icon/Cancel.svelte';
  import Overlay from './Overlay.svelte';
  import Portal from './Portal.svelte';

  // Creating a prop which will determine if we can see the modal windows or not.
  export let isVisible: boolean = false;

  // [(!) Svelte 4 syntax] But to make everything work right we’ll need also to dispatch an event, so the parent component also changes his state with this one.
  const dispatch = createEventDispatcher();
</script>

<!-- What if we want to close modal window with an "Esc" button on a keyboard? Let’s do this. -->
<svelte:window
  on:keydown={(evt) => {
    if (evt.key === 'Escape') dispatch('close');
  }}
/>

<!-- Creating modal component via Portal component for confirmation of user actions such as delete entry and so on. -->
{#if isVisible}
  <Portal>
    <Overlay />
    <div class="center fixed inset-0 z-modal">
      <div class="min-h-56 relative w-full max-w-md rounded-lg bg-white px-10 py-7">
        <button
          class="text-pastel-purple hover:text-daisy-bush absolute top-4 right-4 cursor-pointer transition-colors"
          on:click={() => dispatch('close')}
        >
          <Cancel />
        </button>
        <slot />
      </div>
    </div>
  </Portal>
{/if}
