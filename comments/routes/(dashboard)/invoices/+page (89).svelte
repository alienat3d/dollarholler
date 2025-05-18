<script lang="ts">
  import { onMount } from 'svelte';
  import { invoices, loadInvoices } from '$lib/stores/InvoiceStore';
  import { centsToDollars, sumInvoices } from '$lib/utils/moneyHelpers';
  import CircledAmount from '$lib/components/CircledAmount.svelte';
  import Search from '$lib/components/Search.svelte';
  import SlidePanel from '$lib/components/SlidePanel.svelte';
  import Button from '$lib/components/Button.svelte';
  import InvoiceRow from './InvoiceRow.svelte';
  import BlankState from './BlankState.svelte';
  import InvoiceRowHeader from './InvoiceRowHeader.svelte';
  import InvoiceForm from './InvoiceForm.svelte';
  import { snackbar } from '$lib/stores/SnackbarStore';
  import NoSearchResults from './NoSearchResults.svelte';

  let isInvoiceFormShowing: boolean = false;

  // 89.4 Далее нужно создать переменную "invoiceList", в которой будут находиться отсортированные по ключ. словам в поиске результаты для последующего вывода на страницу.
  let invoiceList: Invoice[] = [];

  // 89.3.1 Создадим эту функцию здесь. Внутри будет константа "keywords", в которую передадим содержимое объекта "searchTerms" или данных, введённых в дочерний комп. Search, который передал нам его сюда вместе с кастомным событием. ↑
  // 89.7 Далее, добавим в "SearchInvoices" фильтр, чтобы в в invoiceList попадали только те инвойсы, которые совпадают с тем, что введено в строку поиска. Мы будем также искать совпадения в разных частях: имени, id или теме. ↓
  const SearchInvoices = (event: CustomEvent) => {
    const keywords = event.detail.searchTerms;

    invoiceList = $invoices.filter(
      (invoice) =>
        invoice?.client?.name.toLowerCase().includes(keywords.toLowerCase()) ||
        invoice?.invoiceNumber.includes(keywords) ||
        invoice?.subject?.toLowerCase().includes(keywords.toLowerCase())
    );
  };

  // 89.12 Эта функция будем смотреть, есть ли в переданном объекте "searchTerms" что-то и если нет, то присваивать содержимое хранилища invoiceList.
  const ClearSearch = (event: CustomEvent) => {
    if (event.detail.searchTerms === '') {
      invoiceList = $invoices;
    }
  };

  // 89.5 Также при загрузке страницы будем помещать загруженные в хранилище инвойсы в invoiceList. ↓
  onMount(async () => {
    await loadInvoices();
    invoiceList = $invoices;
  });
</script>

<svelte:head>
  <title>Invoices | The Dollar Holler</title>
</svelte:head>

<!-- 89.3.0 Теперь нам нужно добавить слушатель кастомного эвента "search", который мы создали в комп. "Search" и когда он сработает, то будет запускаться функция "SearchInvoices". ↑ -->
<div
  class="md:gap-7-4 mb-7 flex flex-col-reverse items-start justify-between gap-y-6 md:flex-row md:items-center lg:mb-16"
>
  <!-- 89.11.1 И также передаём его в родительский комп. слушателем события "clear", которое запустит функцию "ClearSearch". ↑ -->
  <!-- search field -->
  {#if $invoices.length > 0}
    <Search on:search={SearchInvoices} on:clear={ClearSearch} />
  {:else}
    <div />
  {/if}

  <!-- new invoice button -->
  <div>
    <Button
      label="+ Invoice"
      onClick={() => {
        isInvoiceFormShowing = true;
      }}
    />
  </div>
</div>

<!-- 89.10 Теперь вставим этот новый комп. с новым условием, что он будет показываться, когда invoiceList.length <= 0 -->
<!-- Go to [src\lib\components\Search.svelte] -->
<!-- list of invoices -->
<div>
  <!-- invoices -->
  {#if $invoices === null}
    Loading...
  {:else if $invoices.length <= 0}
    <BlankState />
  {:else if invoiceList.length <= 0}
    <NoSearchResults />
  {:else}
    <InvoiceRowHeader className="text-daisyBush" />
    <!-- 89.6 Теперь в цикле поменяем $invoices на invoiceList. ↑ -->
    <div class="flex flex-col-reverse">
      {#each invoiceList as invoice}
        <InvoiceRow {invoice} />
      {/each}
    </div>
    <!-- 89.8 Также заменим здесь обращение за данными к хранилищу и вместо этого к текущему состоянию "invoiceList", чтобы отображалась не общая сумма, а только отфильтрованных\отображаемых элементов. -->
    {#if invoiceList.length > 0}
      <CircledAmount label="Total" amount={`$${centsToDollars(sumInvoices(invoiceList))}`} />
    {/if}
  {/if}
</div>

<!-- slide panel -->
{#if isInvoiceFormShowing}
  <SlidePanel
    on:closePanel={() => {
      isInvoiceFormShowing = false;
    }}
  >
    <InvoiceForm closePanel={() => (isInvoiceFormShowing = false)} />
  </SlidePanel>
{/if}
