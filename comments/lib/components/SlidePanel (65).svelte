<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { clickOutside } from '$lib/actions/ClickOutside';
  import { fly } from 'svelte/transition';
  import Arrow from './Icon/Arrow.svelte';
  import Portal from '$lib/components/Portal.svelte';
  import Overlay from './Overlay.svelte';

  const dispatch = createEventDispatcher();
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') dispatch('close');
  };
</script>

<svelte:window on:keydown={handleKeydown} />

<Portal>
  <Overlay />
  <!-- 65.8 Также добавим и сюда use. -->
  <div
    class="fixed right-0 top-0 z-slidePanel h-screen w-full overflow-y-scroll bg-white px-5 pt-16    shadow-slidePanel lg:w-3/4 lg:py-20 lg:px-32"
    transition:fly={{ x: 1000, duration: 500 }}
    use:clickOutside={() => dispatch('closePanel')}
  >
    <button
      class="absolute top-5 left-7 text-pastelPurple hover:text-daisyBush"
      on:click={() => dispatch('closePanel')}><Arrow /></button
    >
    <slot><!-- optional fallback --></slot>
  </div>
</Portal>
