<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { clickOutside } from '$lib/actions/ClickOutside';
  import Cancel from './Icon/Cancel.svelte';
  import Portal from '$lib/components/Portal.svelte';
  import Overlay from './Overlay.svelte';

  export let isVisible: boolean = false;
  const dispatch = createEventDispatcher<{ close: void }>();

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') dispatch('close');
  };
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isVisible}
  <Portal>
    <Overlay className="!z-modalOverlay" />
    <div class="center fixed inset-0 z-modal">
      <!-- 65.7 Также и здесь добавим use и нашу кастомную функцию в div-обёртку и запускать будем dispatch('close') для закрытия модального окна. -->
      <!-- Go to [src\lib\components\SlidePanel.svelte] -->
      <div
        class="relative min-h-[230px] w-full max-w-[450px] rounded-lg bg-white px-10 py-7"
        use:clickOutside={() => dispatch('close')}
      >
        <button
          on:click={() => dispatch('close')}
          class="absolute right-4 top-4 text-pastelPurple hover:text-daisyBush"><Cancel /></button
        >
        <slot><!-- optional fallback --></slot>
      </div>
    </div>
  </Portal>
{/if}
