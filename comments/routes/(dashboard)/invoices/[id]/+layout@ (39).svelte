<script lang="ts">
  import { afterNavigate, goto } from '$app/navigation';
  import Arrow from '$lib/components/Icon/Arrow.svelte';
  import { invoices } from '$lib/stores/InvoiceStore';

  // 39.4.0 Также понадобится переменная, которая будет хранить ссылку на предыдущую страницу.
  let previousPage: string | undefined = undefined;

  // 39.4.1 У Svelte есть также функция "afterNavigate", которая срабатывает сразу после перехода на страницу. И в объекте "navigation", которая находится в ней есть полезная для нас информация, например страница, с которой мы только что перешли. Её мы и поместим в переменную "previousPage". Но надо расставить "?", на случай, если их не существует, чтобы не было ошибок.
  afterNavigate((navigation) => {
    previousPage = navigation?.from?.url?.pathname;
  });
</script>

<!-- 39.5 Создадим также возможность вернуться на предыдущую страницу по нажатию клавиши "Escape" на клавиатуре. -->
<!-- Go to [src\routes\(dashboard)\invoices\[id]\+page.ts] -->
<svelte:window
  on:keydown={(event) => {
    if (event.key === 'Escape') {
      goto(previousPage || '/invoices');
    }
  }}
/>

<!-- 39.2 Этот файл определяет каким будет макет динамической страницы. Скорее всего этот макет будет использоваться только здесь и потому мы могли бы использовать для этой задачи [src\routes\(dashboard)\invoices\[id]\+page.ts], но хочется для примера придерживаться максимальной чистоты кода. Также не хочется, чтобы этот файл унаследовал что-то из layout-файла Dashboard'а. -->
<!-- 39.3 Каждый лейаут должен иметь слот, т.ч. начнём с создания его, который обычно лежит в теге main. -->
<!-- 39.4.2 Теперь, когда мы получаем ссылку на предыдущую страницу в previousPage мы можем передавать её сюда в тег "a" динамически. -->
<div class="h-full min-h-screen w-screen bg-whisper pt-12 pb-32">
  <main class="mx-auto min-h-screen max-w-screen-lg">
    <a class="fixed top-7 left-7 text-pastelPurple" href={previousPage ? previousPage : '/invoices'}
      ><Arrow /></a
    >
    <slot><!-- optional fallback --></slot>
  </main>
</div>
