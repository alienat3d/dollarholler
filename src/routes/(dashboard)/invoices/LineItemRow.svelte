<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    twoDecimals,
    dollarsToCents,
    centsToDollarsWithoutCommas
  } from '$lib/utils/moneyHelpers';
  import Trash from '$lib/components/Icon/Trash.svelte';

  export let lineItem: LineItem;
  export let canDelete: boolean = false;
  export let isRequired: boolean = false;
  export let isEditable: boolean = true;

  let unitPrice: string = centsToDollarsWithoutCommas(lineItem.amount / lineItem.quantity);
  let amount: string = centsToDollarsWithoutCommas(lineItem.amount);

  $: {
    amount = twoDecimals(lineItem.quantity * Number(unitPrice));
    lineItem.amount = dollarsToCents(Number(amount));
  }

  let dispatch = createEventDispatcher();
</script>

<div class="invoice-line-item border-b-2 border-fog py-4 sm:py-2">
  <div class="description">
    <label class="line-item-label" for="description">Description</label>
    <input
      class="line-item"
      type="text"
      name="description"
      disabled={!isEditable}
      bind:value={lineItem.description}
      required={isRequired}
    />
  </div>

  <div class="unitPrice">
    <label class="line-item-label mr-4 text-right" for="unitPrice">Unit Price</label>
    <input
      class="line-item text-right"
      type="number"
      name="unitPrice"
      step="0.01"
      min="0"
      disabled={!isEditable}
      bind:value={unitPrice}
      on:blur={() => {
        unitPrice = twoDecimals(Number(unitPrice));
        dispatch('updateLineItem');
      }}
      required={isRequired}
    />
  </div>

  <div class="qty">
    <label class="line-item-label mr-2 text-center" for="quantity">Qty.</label>
    <input
      class="line-item text-center"
      type="number"
      name="quantity"
      min="0"
      disabled={!isEditable}
      bind:value={lineItem.quantity}
      on:blur={() => {
        dispatch('updateLineItem');
      }}
      required={isRequired}
    />
  </div>

  <div class="amount">
    <label class="line-item-label mr-4 text-right" for="amount">Amount</label>
    <input
      class="line-item text-right"
      type="number"
      name="amount"
      step="0.01"
      min="0"
      bind:value={amount}
      disabled
    />
  </div>

  <div class="trash">
    {#if canDelete && isEditable}
      <button
        on:click|preventDefault={() => {
          dispatch('removeLineItem', lineItem.id);
        }}
        class="center h-10 w-10 text-pastelPurple hover:text-lavenderIndigo"><Trash /></button
      >
    {/if}
  </div>
</div>

<style lang="postcss">
  input[type='text'],
  input[type='number'] {
    @apply h-10 w-full border-b-2 border-dashed border-stone-300;
  }

  input[type='text'] {
    @apply font-sansSerif text-xl font-bold;
  }

  input[type='number'] {
    @apply font-mono text-base;
  }

  input[type='text']:focus,
  input[type='number']:focus {
    @apply border-solid border-lavenderIndigo outline-none;
  }

  input[type='number']:disabled,
  input[type='text']:disabled {
    @apply border-b-0 bg-transparent px-0;
  }

  .line-item-label {
    @apply block print:hidden sm:hidden;
  }
</style>
