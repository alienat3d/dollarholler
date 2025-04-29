<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Portal from '$lib/components/Portal.svelte';
  import Cancel from './Icon/Cancel.svelte';
  import Overlay from './Overlay.svelte';

  export let isVisible: boolean = false;
  const dispatch = createEventDispatcher();
</script>

<svelte:window
  on:keydown={(event) => {
    if (event.key === 'Escape') {
      dispatch('close');
    }
  }}
/>

{#if isVisible}
  <Portal>
    <!-- 35.15.2 И добавим в Overlay комп. этот класс. А чтобы он не конфликтовал с оригинальным "z-overlay" внутри комп. Overlay, то мы можем добавить "!" этому классу, сделав его "!important" -->
    <!-- Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte] -->
    <Overlay className="!z-modalOverlay" />
    <div class="center fixed inset-0 z-modal">
      <div class="relative min-h-[230px] w-full max-w-[450px] rounded-lg bg-white px-10 py-7">
        <button
          on:click={() => dispatch('close')}
          class="absolute right-4 top-4 text-pastelPurple hover:text-daisyBush"><Cancel /></button
        >
        <slot><!-- optional fallback --></slot>
      </div>
    </div>
  </Portal>
{/if}
