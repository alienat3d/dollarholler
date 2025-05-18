<script lang="ts">
  import { onMount } from 'svelte';
  import { loadClients, clients } from '$lib/stores/ClientStore';
  import Button from '$lib/components/Button.svelte';
  import Search from '$lib/components/Search.svelte';
  import SlidePanel from '$lib/components/SlidePanel.svelte';
  import ClientRowHeader from './ClientRowHeader.svelte';
  import ClientRow from './ClientRow.svelte';
  import BlankState from './BlankState.svelte';
  import ClientForm from './ClientForm.svelte';
  import NoSearchResults from './NoSearchResults.svelte';

  let isClientFormShowing: boolean = false;
  // 90.1 Нам также понадобится переменная для сохранения массива клиентов в неё.
  let clientList: Client[] = [];

  const closePanel = () => (isClientFormShowing = false);

  // 90.2 В данную функцию мы поместим принятый из комп. "Search" объект с данными ввода и поместим в "keywords", затем в clientList мы отфильтруем только тех клиентов, что совпадут по имени со вводом в keywords.
  const SearchClients = (event: CustomEvent) => {
    const keywords = event.detail.searchTerms;

    clientList = $clients.filter(
      (client) =>
        client.name?.toLocaleLowerCase().includes(keywords.toLocaleLowerCase()) ||
        client.email?.toLocaleLowerCase().includes(keywords.toLocaleLowerCase())
    );
  };

  // 90.3 Здесь мы, также как и на странице инвойсов проверим, что если вернувшийся из "Search" объект "searchTerms" пуст, то обновим переменную clientList, а также и вёрстку с хранилищем, т.е. списком всех клиентов. ↓
  const ClearSearch = (event: CustomEvent) => {
    if (event.detail.searchTerms === '') clientList = $clients;
  };

  // 90.2 Чуть модифицируем функцию загрузки данных клиентов, сделав её асинхронной. А также присвоим новой переменной clientList хранилище с клиентами.
  onMount(async () => {
    await loadClients();
    clientList = $clients;
  });
</script>

<svelte:head>
  <title>Clients | The Dollar Holler</title>
</svelte:head>

<div
  class="md:gap-7-4 mb-7 flex flex-col-reverse items-start justify-between gap-y-6 md:flex-row md:items-center lg:mb-16"
>
  <!-- * 90.0 Сделаем функцию поиска\сортировки также и для страницы списка клиентов. Комп. "Search" уже готов, но нужно ему добавить слушатель события "search", чтобы он запускал функцию "SearchClients", которую опишем выше. А также нам нужно слушать событие "clear", которое запустит функцию очистки ввода "ClearSearch". ↑ -->
  <!-- search field -->
  {#if $clients.length > 0}
    <Search on:search={SearchClients} on:clear={ClearSearch} />
  {:else}
    <div />
  {/if}

  <!-- new invoice button -->
  <div>
    <Button label="+ Client" onClick={() => (isClientFormShowing = true)} />
  </div>
</div>

<!-- clients -->
<div>
  {#if $clients === null}
    Loading...
  {:else if $clients.length <= 0}
    <BlankState />
  {:else if clientList.length <= 0}
    <NoSearchResults />
  {:else}
    <!-- client header row -->
    <ClientRowHeader />

    <!-- 90.4 Теперь, вместо того, чтобы пробегаться циклом по всему хранилищу, мы будем это делать только по clientList, чтобы отображать лишь отсортированных клиентов, если пользователь использовал поиск. -->
    <!-- Go to [src\routes\(dashboard)\clients\NoSearchResults.svelte] -->
    <!-- client rows -->
    <div class="flex flex-col-reverse">
      <!-- {#each $clients as client} -->
      {#each clientList as client}
        <ClientRow {client} />
      {/each}
    </div>
  {/if}
</div>

{#if isClientFormShowing}
  <SlidePanel on:closePanel={closePanel}>
    <ClientForm {closePanel} />
  </SlidePanel>
{/if}
