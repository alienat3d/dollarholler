<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  import CircledAmount from '$lib/components/CircledAmount.svelte';
  import LineItemRow from './LineItemRow.svelte';
  import {
    addThousandsSeparator,
    centsToDollars,
    sumLineItems,
    twoDecimals
  } from '$lib/utils/moneyHelpers';

  let subtotal: string = '0.00';
  export let discount: number = 0;
  let discountedAmount: string = '0.00';
  let total: string = '0.00';

  // 41.3.1 Создадим сам проп с булевым значением. ↓
  export let isEditable: boolean = true;

  export let lineItems: LineItem[] | undefined = undefined;
  let dispatch = createEventDispatcher();

  $: if (sumLineItems(lineItems) > 0) {
    subtotal = centsToDollars(sumLineItems(lineItems));
  }
  $: if (subtotal && discount) {
    discountedAmount = centsToDollars(sumLineItems(lineItems) * (discount / 100));
  }

  // 41.7 Ещё был замечен баг с большими суммами, где есть ",", которая меняет тип данных на строчный и ломает логику, в итоге показывая вместо числа "NaN". Потому модифицируем расчёт немного. Вместо реактивной строчки кода сделаем реактивный блок кода, поместив его в {}. Затем добавим переменную plainSubtotal, в которую поместим функцию replace, которая будет убирать запятые из subtotal, чтобы они не меняли тип данных и не мешали расчётам.
  // Go to [src\lib\utils\moneyHelpers.ts]
  // 41.10.1 Поэтому мы добавим в total ещё и метод "addThousandsSeparator".
  $: {
    const plainSubtotal = subtotal.replace(',', '');
    total = addThousandsSeparator(twoDecimals(Number(plainSubtotal) - Number(discountedAmount)));
  }
</script>

<div class="invoice-line-item border-b-2 border-daisyBush pb-2">
  <div class="table-header">Description</div>
  <div class="table-header mr-3.5 text-right">Unit Price</div>
  <div class="table-header mr-3.5 text-center">Qty</div>
  <div class="table-header mr-3.5 text-right">Amount</div>
</div>

<!-- 41.3.2 А также передадим его сюда. -->
{#if lineItems}
  {#each lineItems as lineItem, index}
    <LineItemRow
      {lineItem}
      on:removeLineItem
      canDelete={index > 0}
      on:updateLineItem
      isRequired={index === 0}
      {isEditable}
    />
  {/each}
{/if}

<!-- 41.3.3 Нам также стоит показывать кнопку добавления новых инвойсов лишь в случае, если isEditable в положении true. ↓ -->
<div class="invoice-line-item">
  <div class="col-span-1 sm:col-span-2">
    {#if isEditable}
      <Button
        isAnimated={false}
        label="+ Line Item"
        style="textOnly"
        onClick={() => dispatch('addLineItem')}
      />
    {/if}
  </div>
  <div class="py-5 text-right font-bold text-monsoon">Subtotal</div>
  <div class="py-5 text-right font-mono">${subtotal}</div>
</div>

<!-- 41.3.4 Также заблокируем инпут, если у нас isEditable - false. -->
<!-- Go to [src\routes\(dashboard)\invoices\LineItemRow.svelte] -->
<div class="invoice-line-item">
  <div class="col-span-1 py-5 text-right font-bold text-monsoon sm:col-span-2">Discount</div>
  <div class="relative">
    <input
      class="line-item h-10 w-full border-b-2 border-dashed border-stone-300 pr-4 text-right focus:border-solid focus:border-lavenderIndigo focus:outline-none"
      class:bg-white={!isEditable}
      type="number"
      name="discount"
      min="0"
      max="100"
      disabled={!isEditable}
      bind:value={discount}
      on:change={() => dispatch('updateDiscount', { discount })}
    />
    <span class="text-mono absolute right-0 top-2">%</span>
  </div>
  <div class="py-5 text-right font-mono">${discountedAmount}</div>
</div>

<!-- 41.10.0 Однако в итоговой сумме нам бы всё же хотелось видеть запятую, т.к. она улучшает читабельность. ↑ -->
<div class="invoice-line-item">
  <div class="col-span-3 sm:col-span-6">
    <CircledAmount label="Total:" amount={`$${total}`} />
  </div>
</div>

<style lang="postcss">
  .table-header {
    @apply hidden text-sm font-bold text-daisyBush sm:block;
  }
</style>
