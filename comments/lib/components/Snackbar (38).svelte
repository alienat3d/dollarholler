<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { snackbar } from '$lib/stores/SnackbarStore';
  import Cancel from './Icon/Cancel.svelte';
  import Portal from './Portal.svelte';
  import SnackbarMessage from './SnackbarMessage.svelte';
</script>

<!-- * 38.0 В этом уроке мы создадим компонент для всплывающий информационных сообщений. Эта фича нам пригодится, например, чтобы уведомлять пользователя об успешном создании, изменении или удалении инвойсов. Начнём с добавления сюда комп. Portal, чтобы вставлять это сообщение снаружи существующего слота. -->
<!-- 38.2 Здесь мы будем также динамически добавлять класс. -->
<!-- 38.3.0 Для самого сообщения мы создадим ещё один компонент SnackbarMessage. -->
<!-- Go to [src\lib\components\SnackbarMessage.svelte] -->
<!-- 38.10.0 Настало время использовать наше новое хранилище и показать этот div для каждого сообщения в этом хранилище с помощью "each". Ключом у нас будет id из хранилища, которое генерируется либой uuid. -->
<!-- 38.10.1 Также нам нужно дописать кнопке, что мы будем запускать метод хранилища "remove" и передавать туда id конкретного сообщения по клику на эту кнопку. -->
<!-- Go to [src\routes\(dashboard)\+layout.svelte] -->
<!-- 38.12 Т.к. нам нужно, чтобы сообщение всплывало вверху и по центру, то используем доп. обёртку div, чтобы добавить кое-какие стили. -->
<!-- 38.13.0 Добавим также немного анимации, чтобы наши сообщения выглядели более симпатично. Здесь нам помогут встроенные в Svelte "fly" & "fade" анимации. -->
<!-- 38.13.1 Добавим div'у анимацию "fly" с некоторыми параметрами. Входящая анимация "in" должна использовать "fly" и иметь opacity: 0, y: -100, а уходящая "out": "fade" и иметь длительность 300 мс. -->
<!-- 38.13.2 Выглядит уже довольно неплохо, но недостаточно, для более плавной анимации сообщений между первым и последним добавим ещё "flip." -->
<!-- Go to [src\lib\components\SnackbarMessage.svelte] -->
<Portal>
  <div class="fixed top-5 left-1/2 z-toaster -translate-x-1/2">
    {#each $snackbar as content (content.id)}
      <div in:fly={{ opacity: 0, y: -100 }} out:fade={{ duration: 300 }} animate:flip>
        <div
          class="mb-2 inline-block rounded-lg px-5 py-4 text-lg font-bold"
          class:info={content.type === 'info'}
          class:warning={content.type === 'warning'}
          class:error={content.type === 'error'}
          class:success={content.type === 'success'}
        >
          <div class="flex gap-4">
            <SnackbarMessage message={content.message} />
            <button on:click={() => snackbar.remove(content.id)}><Cancel /></button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</Portal>

<!-- 38.1 Итак, у нас будут разные типы сообщений и нам нужны разные стили, в зависимости от типа сообщения. -->
<style lang="postcss">
  .info {
    @apply bg-prim text-daisyBush;
  }

  .warning {
    @apply bg-goldenFizz text-scarlet;
  }

  .error {
    @apply bg-scarlet text-goldenFizz;
  }

  .success {
    @apply bg-robinEggBlue text-daisyBush;
  }
</style>
