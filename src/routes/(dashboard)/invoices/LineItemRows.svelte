<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  import CircledAmount from '$lib/components/CircledAmount.svelte';
  import LineItemRow from './LineItemRow.svelte';
  import { centsToDollars, sumLineItems, twoDecimals } from '$lib/utils/moneyHelpers';

  let subtotal: string = '0.00';
  // 29.7 Мы также должны создать переменные для скидок, где "discountedAmount" будет строкой, потому, что нам нужна строка для конвертации в доллары методом.
  let discount: number;
  let discountedAmount: string = '0.00';
  let total: string = '0.00';

  export let lineItems: LineItem[] | undefined = undefined;
  let dispatch = createEventDispatcher();

  // 29.0 Суммируем все записи, поместив в "sumLineItems" сами записи "lineItems"
  $: if (sumLineItems(lineItems) > 0) {
    // 29.1 Также позаботимся о том, чтобы центы конвертировались в доллары при помощи метода "centsToDollars".
    // Go to [src\routes\(dashboard)\invoices\LineItemRow.svelte]
    subtotal = centsToDollars(sumLineItems(lineItems));
  }
  // 29.8 Здесь мы применим простую формулу расчёта процентов и также переведём в доллары. Мы также создадим условие, что обновлять мы будем значение только, если у нас существуют subtotal & discount.
  $: if (subtotal && discount) {
    discountedAmount = centsToDollars(sumLineItems(lineItems) * (discount / 100));
  }

  // 29.9 И наконец общее значение, которое тоже будет реактивным, мы переведём subtotal и discountedAmount в числовой тип данных и вычтем одно из другого, а потом переведём в дробное значение для центов. ↓
  $: total = twoDecimals(parseInt(subtotal) - parseInt(discountedAmount));
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
    <!-- 29.4 Теперь мы передаём дальше наверх этот эвент, чтобы конечный родительский компонент "InvoiceForm" получил отклик, где мы сохраняем данные. -->
    <!-- Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte] -->
    <LineItemRow {lineItem} on:removeLineItem canDelete={index > 0} on:updateLineItem />
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
    <!-- 29.6.0 Теперь займёмся полем скидки и нам нужно привязать эту строку к значению стейта с помощью "bind". -->
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
  <!-- 29.6.1 Также нам нужно и здесь указывать динамическое значение "discountedAmount". ↑ -->
  <div class="py-5 text-right font-mono">${discountedAmount}</div>
</div>

<div class="invoice-line-item">
  <div class="col-span-6">
    <!-- 29.10 Здесь мы заменим хард код на динамическое значение общей суммы total. -->
    <CircledAmount label="Total:" amount={`$${total}`} />
  </div>
</div>

<style lang="postcss">
  .table-header {
    @apply text-sm font-bold text-daisyBush;
  }
</style>
