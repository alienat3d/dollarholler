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

  let isInvoiceFormShowing: boolean = false;

  onMount(() => {
    loadInvoices();
  });
</script>

<svelte:head>
  <title>Invoices | The Dollar Holler</title>
</svelte:head>

<div
  class="md:gap-7-4 mb-7 flex flex-col-reverse items-start justify-between gap-y-6 md:flex-row md:items-center lg:mb-16"
>
  <!-- search field -->
  {#if $invoices.length > 0}
    <Search />
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

<!-- list of invoices -->
<div>
  <!-- invoices -->
  {#if $invoices === null}
    Loading...
  {:else if $invoices.length <= 0}
    <BlankState />
  {:else}
    <InvoiceRowHeader className="text-daisyBush" />
    <div class="flex flex-col-reverse">
      {#each $invoices as invoice}
        <InvoiceRow {invoice} />
      {/each}
    </div>
    <CircledAmount label="Total" amount={`$${centsToDollars(sumInvoices($invoices))}`} />
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
