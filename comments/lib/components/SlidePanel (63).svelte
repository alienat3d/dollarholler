<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Portal from '$lib/components/Portal.svelte';
  import Arrow from './Icon/Arrow.svelte';
  import Overlay from './Overlay.svelte';
  import { fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();
</script>

<svelte:window
  on:keydown={(event) => {
    if (event.key === 'Escape') {
      dispatch('close');
    }
  }}
/>

<Portal>
  <Overlay />
  <!-- * 63.0 Занимаемся анимацией компонентов дальше. Теперь пришёл черёд выдвижной панели с формами. Здесь, в отличии от строки поиска мы уже используем арсенал самого Svelte и в частности анимацию движения "fly". И нам нужно, чтобы панель выдвигалась справа, т.к. добавим также нужные настройки. -->
  <!-- Go to [src\lib\components\Overlay.svelte] -->
  <div
    class="fixed right-0 top-0 z-slidePanel h-screen w-full overflow-y-scroll bg-white px-5 pt-16    shadow-slidePanel lg:w-3/4 lg:py-20 lg:px-32"
    transition:fly={{ x: 1000, duration: 500 }}
  >
    <button
      class="absolute top-5 left-7 text-pastelPurple hover:text-daisyBush"
      on:click={() => dispatch('closePanel')}><Arrow /></button
    >
    <slot><!-- optional fallback --></slot>
  </div>
</Portal>
