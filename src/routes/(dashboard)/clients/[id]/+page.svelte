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

  let isClientFormShowing: boolean = false;
  let isEditingCurrentClient: boolean = false;

  export let data;

  const addClient = () => {
    isEditingCurrentClient = false;
    isClientFormShowing = true;
  };

  const editClient = () => {
    isEditingCurrentClient = true;
    isClientFormShowing = true;
  };

  const closePanel = () => (isClientFormShowing = false);

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
  <h1 class="font-sansSerif text-3xl font-bold text-daisyBush">Compressed.fm</h1>
  <Button label="Edit" style="textOnly" isAnimated={false} iconLeft={Edit} onClick={editClient} />
</div>

<div class="mb-10 grid grid-cols-1 gap-4 rounded-lg bg-gallery py-7 px-10 lg:grid-cols-4">
  <div class="summary-block">
    <div class="label">Total Overdue</div>
    <div class="number"><sup>$</sup>520.00</div>
  </div>
  <div class="summary-block">
    <div class="label">Total Outstanding</div>
    <div class="number"><sup>$</sup>380.30</div>
  </div>
  <div class="summary-block">
    <div class="label">Total Draft</div>
    <div class="number"><sup>$</sup>760.50</div>
  </div>
  <div class="summary-block">
    <div class="label">Total Paid</div>
    <div class="number"><sup>$</sup>2555.75</div>
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
