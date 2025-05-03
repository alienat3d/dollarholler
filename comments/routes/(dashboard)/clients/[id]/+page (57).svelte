<script lang="ts">
  import { onMount } from 'svelte';
  import { loadInvoices } from '$lib/stores/InvoiceStore';
  import { centsToDollars, sumInvoices } from '$lib/utils/moneyHelpers';
  import Edit from '$lib/components/Icon/Edit.svelte';
  import CircledAmount from '$lib/components/CircledAmount.svelte';
  import Search from '$lib/components/Search.svelte';
  import Button from '$lib/components/Button.svelte';
  import SlidePanel from '$lib/components/SlidePanel.svelte';
  import InvoiceRow from '../../invoices/InvoiceRow.svelte';
  import BlankState from '../../invoices/BlankState.svelte';
  import InvoiceRowHeader from '../../invoices/InvoiceRowHeader.svelte';
  import ClientForm from '../ClientForm.svelte';
  import { isLate } from '$lib/utils/dateHelpers';

  let isClientFormShowing: boolean = false;
  let isEditingCurrentClient: boolean = false;

  export let data: { client: Client };

  const addClient = () => {
    isEditingCurrentClient = false;
    isClientFormShowing = true;
  };

  const editClient = () => {
    isEditingCurrentClient = true;
    isClientFormShowing = true;
  };

  const closePanel = () => (isClientFormShowing = false);

  // 57.2 Сперва создадим функцию getDraft. Внутри неё будет переменная, которая содержит все инвойсы со статусом "draft" и мы будем их фильтровать методом "filter". И у нас уже есть метод в moneyHelpers, который суммирует все инвойсы, которые в него попадают "sumInvoices". А затем также переведём значение в доллары, при помощи доп. метода "centsToDollars".
  // 57.2 Также, чтобы избавиться от TS-ошибок и сделать наш код надёжнее сделаем проверку на существование данных и что у нас больше одного инвойса, иначе будем возвращать 0. ↓
  const getDraft = (): string => {
    if (!data.client.invoices || data.client.invoices.length < 1) return '0.00';

    const draftInvoices = data.client.invoices.filter(
      (invoice) => invoice.invoiceStatus === 'draft'
    );

    return centsToDollars(sumInvoices(draftInvoices));
  };

  // 57.4.0 Похожей функцией на "getDraft" будет и "getPaid", но мы поменяем фильтр по статусу инвойсов с "draft" на "paid". ↓
  const getPaid = (): string => {
    if (!data.client.invoices || data.client.invoices.length < 1) return '0.00';

    const paidInvoices = data.client.invoices.filter((invoice) => invoice.invoiceStatus === 'paid');

    return centsToDollars(sumInvoices(paidInvoices));
  };

  // 57.5.0 Нам также понадобится функция "getTotalOverdue" для заполнения графы "Total Overdue", которая также похожа на обе функции сверху, но здесь мы фильтруем инвойсы по статусу "sent", а также нам нужна проверка, что этот инвойс также просрочен - "late". Для второй проверки у нас уже была функция в dateHelpers "isLate", которую удобно здесь использовать и в неё мы поместим данные из "invoice.dueDate".
  const getTotalOverdue = (): string => {
    if (!data.client.invoices || data.client.invoices.length < 1) return '0.00';

    const paidInvoices = data.client.invoices.filter(
      (invoice) => invoice.invoiceStatus === 'sent' && isLate(invoice.dueDate)
    );

    return centsToDollars(sumInvoices(paidInvoices));
  };

  // 57.6.0 Осталось написать функцию для графы "Total Outstanding" и она будет похожа на предыдущие 3 функции, но теперь мы ищем инвойсы, которые ещё не были оплачены и ещё не просрочены.
  const getTotalOutstanding = (): string => {
    if (!data.client.invoices || data.client.invoices.length < 1) return '0.00';

    const paidInvoices = data.client.invoices.filter(
      (invoice) => invoice.invoiceStatus === 'sent' && !isLate(invoice.dueDate)
    );

    return centsToDollars(sumInvoices(paidInvoices));
  };

  onMount(() => loadInvoices());
</script>

<svelte:head><title>Invoices | The Dollar Holler</title></svelte:head>

<div
  class="md:gap-7-4 mb-7 flex flex-col-reverse items-start justify-between gap-y-6 md:flex-row md:items-center lg:mb-16"
>
  <!-- search field -->
  {#if data.client.invoices && data.client.invoices.length > 0}
    <Search />
  {:else}
    <div />
  {/if}

  <!-- new invoice button -->
  <div><Button label="+ Client" onClick={addClient} /></div>
</div>

<div class="mb-7 flex w-full items-center justify-between">
  <h1 class="font-sansSerif text-3xl font-bold text-daisyBush">{data.client.name}</h1>
  <Button label="Edit" style="textOnly" isAnimated={false} iconLeft={Edit} onClick={editClient} />
</div>

<!-- * 57.0 В этом уроке займёмся написанием функции калькуляции общей статистики по выплатам для конкретного клиента из данных, полученных из инвойсов хранилища и подставим динамически их суммы сюда. -->
<!-- 57.1 Начнём мы с графы "Total Draft", и здесь на самом деле довольно легко фильтровать, т.к. каждый инвойс имеет статус и по нему можно определить относится ли платёж к "draft". Тоже касается и графы "Total Paid". ↑ -->
<!-- 57.3 Подставим запуск новой функции "getDraft" вместо хардкода. ↑ -->
<!-- 57.4.1 Также подставляем эту функцию в значение. ↑ -->
<!-- 57.5.1 И также выполнение этой функции ставится в значение для графы "Total Overdue". ↑ -->
<div class="mb-10 grid grid-cols-1 gap-4 rounded-lg bg-gallery py-7 px-10 lg:grid-cols-4">
  <div class="summary-block">
    <div class="label">Total Overdue</div>
    <div class="number"><sup>$</sup>{getTotalOverdue()}</div>
  </div>
  <div class="summary-block">
    <div class="label">Total Outstanding</div>
    <div class="number"><sup>$</sup>{getTotalOutstanding()}</div>
  </div>
  <div class="summary-block">
    <div class="label">Total Draft</div>
    <div class="number"><sup>$</sup>{getDraft()}</div>
  </div>
  <div class="summary-block">
    <div class="label">Total Paid</div>
    <div class="number"><sup>$</sup>{getPaid()}</div>
  </div>
</div>

<!-- list of invoices -->
<div>
  <!-- invoices -->
  {#if data.client.invoices === null}
    Loading...
  {:else if data.client.invoices.length <= 0}
    <BlankState />
  {:else}
    <InvoiceRowHeader className="text-daisyBush" />
    <div class="flex flex-col-reverse">
      {#each data.client.invoices as invoice}
        <InvoiceRow {invoice} />
      {/each}
    </div>
    <CircledAmount label="Total" amount={`$${centsToDollars(sumInvoices(data.client.invoices))}`} />
  {/if}
</div>

<!-- slide panel -->
{#if isClientFormShowing}
  <SlidePanel on:closePanel={closePanel}>
    <ClientForm
      {closePanel}
      formState={isEditingCurrentClient ? 'edit' : 'create'}
      client={isEditingCurrentClient ? data.client : undefined}
    />
  </SlidePanel>
{/if}

<style lang="postcss">
  .summary-block {
    @apply text-center;
  }

  .label {
    @apply text-sm font-black text-[#a397ad];
  }

  sup {
    @apply relative -top-2;
  }

  .number {
    @apply truncate text-[2.5rem] font-black text-purple;
  }
</style>
