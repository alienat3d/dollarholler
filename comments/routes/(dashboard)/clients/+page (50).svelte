<script lang="ts">
  import { onMount } from 'svelte';
  import { loadClients, clients } from '$lib/stores/ClientStore';
  import Button from '$lib/components/Button.svelte';
  import Search from '$lib/components/Search.svelte';
  import ClientRowHeader from './ClientRowHeader.svelte';
  import ClientRow from './ClientRow.svelte';

  // 50.4 Надо также сделать динамическое заполнение вёрстки данными из хранилища клиентов. Но сперва ещё добавим в файл сид [src\seed.json] дополнительное поле клиентам, а точнее их статус "активный/архивный". С помощью, уже созданной нами ранее, функции loadClients мы загрузим данные и заполним ими вёрстку, а точнее компоненты "ClientRow". ↓
  onMount(() => {
    loadClients();
  });
</script>

<svelte:head>
  <title>Clients | The Dollar Holler</title>
</svelte:head>

<!-- * 50.0 Создаём страницу перечня имеющихся в БД клиентов. Эта страница очень похожа на страницу инвойсов, только она будет отображать клиентов, но многое мы возьмём и переиспользуем оттуда, например верх с кнопками и поиском. -->
<div
  class="md:gap-7-4 mb-7 flex flex-col-reverse items-start justify-between gap-y-6 md:flex-row md:items-center lg:mb-16"
>
  <!-- search field -->
  <!-- {#if $clients === null} -->
  <Search />
  <!-- {:else}
    <div />
  {/if} -->

  <!-- new invoice button -->
  <div>
    <Button
      label="+ Client"
      onClick={() => {
        // isInvoiceFormShowing = true;
      }}
    />
  </div>
</div>

<!-- clients -->
<div>
  <!-- 50.1 Мы используем ту же логику здесь, что и в секции с инвойсами, т.ч. мы поместим client header row в отдельный компонент, чтобы использовать не только здесь, но и на других страницах. -->
  <!-- Go to [src\routes\(dashboard)\clients\ClientRow.svelte] -->
  <!-- 50.5 Здесь мы укажем условие, что если хранилище клиентов равняется null, то будем показывать просто Loading..., если меньше или равно 0, то будет просто "Blank State", иначе будем передавать данные в компоненты. -->
  {#if $clients === null}
    Loading...
  {:else if $clients.length <= 0}
    Blank State
  {:else}
    <!-- client header row -->
    <ClientRowHeader />

    <!-- 50.2 Также мы поступим и со строками информации о клиентах. -->
    <!-- 50.6 При помощи цикла "each" распечатаем всех клиентов в список с передачей данных о каждом клиенте в комп. ClientRow. -->
    <!-- 50.7 Т.к. у нас есть небольшой баг со всплывающими по клику на кнопку "три точки" контекстными меню (кнопки вылазят поверх показанного меню), то нам нужно обернуть в доп. div, чтобы сделать им реверсный порядок. -->
    <!-- Go to [src\routes\(dashboard)\clients\ClientRow.svelte] -->
    <!-- client rows -->
    <div class="flex flex-col-reverse">
      {#each $clients as client}
        <ClientRow {client} />
      {/each}
    </div>
  {/if}
</div>
