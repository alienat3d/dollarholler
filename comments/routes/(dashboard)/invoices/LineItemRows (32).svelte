<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  import CircledAmount from '$lib/components/CircledAmount.svelte';
  import LineItemRow from '../../../../src/routes/(dashboard)/invoices/LineItemRow.svelte';
  import { centsToDollars, sumLineItems, twoDecimals } from '$lib/utils/moneyHelpers';

  let subtotal: string = '0.00';
  let discount: number;
  let discountedAmount: string = '0.00';
  let total: string = '0.00';

  export let lineItems: LineItem[] | undefined = undefined;
  let dispatch = createEventDispatcher();

  $: if (sumLineItems(lineItems) > 0) {
    subtotal = centsToDollars(sumLineItems(lineItems));
  }

  $: if (subtotal && discount) {
    discountedAmount = centsToDollars(sumLineItems(lineItems) * (discount / 100));
  }

  $: total = twoDecimals(parseInt(subtotal) - parseInt(discountedAmount));
</script>

<div class="invoice-line-item border-b-2 border-daisyBush pb-2">
  <div class="table-header">Description</div>
  <div class="table-header text-right">Unit Price</div>
  <div class="table-header text-center">Qty</div>
  <div class="table-header text-right">Amount</div>
</div>

<!-- 33.2 Теперь мы хотим поставить атрибут "required" но только первому полю инвойса, для этого мы запишем "isRequired" похожим образом, как мы делали с "canDelete": -->
<!-- Go to [src\routes\(dashboard)\invoices\LineItemRow.svelte] -->
{#if lineItems}
  {#each lineItems as lineItem, index}
    <LineItemRow
      {lineItem}
      on:removeLineItem
      canDelete={index > 0}
      on:updateLineItem
      isRequired={index === 0}
    />
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
  <div class="py-5 text-right font-mono">${subtotal}</div>
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
      bind:value={discount}
    />
    <span class="text-mono absolute right-0 top-2">%</span>
  </div>
  <div class="py-5 text-right font-mono">${discountedAmount}</div>
</div>

<div class="invoice-line-item">
  <div class="col-span-6">
    <CircledAmount label="Total:" amount={`$${total}`} />
  </div>
</div>

<style lang="postcss">
  .table-header {
    @apply text-sm font-bold text-daisyBush;
  }
</style>
