<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  import CircledAmount from '$lib/components/CircledAmount.svelte';
  import LineItemRow from './LineItemRow.svelte';

  export let lineItems: LineItem[] | undefined = undefined;
  let dispatch = createEventDispatcher();
</script>

<div class="invoice-line-item border-b-2 border-daisyBush pb-2">
  <div class="table-header">Description</div>
  <div class="table-header text-right">Unit Price</div>
  <div class="table-header text-center">Qty</div>
  <div class="table-header text-right">Amount</div>
</div>

<!-- 28.1 Здесь нам пригодится добавить index и указать, что всякий раз, когда индекс элемента больше 0, то canDelete будет правдой. Т.о. все элементы будут удаляться, кроме самого первого. -->
{#if lineItems}
  {#each lineItems as lineItem, index}
    <LineItemRow {lineItem} on:removeLineItem canDelete={index > 0} />
  {/each}
{/if}

<div class="invoice-line-item">
  <div class="col-span-2">
    <Button
      isAnimated={false}
      label="+ Line Item"
      style="textOnly"
      onClick={() => {
        dispatch('addLineItem');
      }}
    />
  </div>
  <div class="py-5 text-right font-bold text-monsoon">Subtotal</div>
  <div class="py-5 text-right font-mono">$250.00</div>
</div>

<div class="invoice-line-item">
  <div class="col-span-2 py-5 text-right font-bold text-monsoon">Discount</div>
  <div class="relative">
    <input
      class="line-item h-10 w-full border-b-2 border-dashed border-stone-300 pr-4 text-right focus:border-solid focus:border-lavenderIndigo focus:outline-none"
      type="number"
      name="discount"
      min="0"
      max="100"
    />
    <span class="text-mono absolute right-0 top-2">%</span>
  </div>
  <div class="py-5 text-right font-mono">$10.00</div>
</div>

<div class="invoice-line-item">
  <div class="col-span-6">
    <CircledAmount label="Total:" amount="$1,444.00" />
  </div>
</div>

<style lang="postcss">
  .table-header {
    @apply text-sm font-bold text-daisyBush;
  }
</style>
