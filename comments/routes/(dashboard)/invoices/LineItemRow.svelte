<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { dollarsToCents, twoDecimals } from '$lib/utils/moneyHelpers';
  import Trash from '$lib/components/Icon/Trash.svelte';

  export let lineItem: LineItem;

  // 28.0 Вообще, для лучшего UX было бы хорошо, если бы мы могли удалять все линии инвойсов, кроме самого первого. Для этой задачи мы добавим контролер "canDelete", который будет определять, можно ли удалить эту линию или нет. И теперь нам нужно передать этот проп в родительский [LineItemRows.svelte]
  export let canDelete: boolean = false;

  // Мы помним, что у Quantity, Unit Price & Amount есть взаимосвязь и Quantity * Unit Price = Amount, т.ч. нам не нужно хранить их все в БД. Сделаем так, что когда мы будем менять Quantity или Unit Price, то и Amount будет меняться автоматически. Для этого пропишем здесь эту формулу. Мы также можем использовать, сделанную нами раньше, функцию, которая обрезает дроби до двух после точки.
  let unitPrice: string = twoDecimals(lineItem.amount / lineItem.quantity);

  // Также у нас будет отдельная переменная под Amount. И мы также хотим, чтобы amount обновлялось каждый раз, когда значение Unit Price и/или Qty. поменяются.
  let amount: string = twoDecimals(lineItem.amount);

  // В Svelte можно объявить часть кода реактивным с помощью знака $. И это значит, что Svelte перезапустит этот код каждый раз, когда значение переменных в нём поменяется. (Похоже на useEffect в React)
  // А также обновим и lineItem.amount, чтобы тут же синхронизировать данные. Но также не забудем, что мы храним это значение уже только в центах и для этого используем ещё одну новую функцию-помощника "dollarsToCents".
  $: {
    amount = twoDecimals(lineItem.quantity * Number(unitPrice));
    lineItem.amount = dollarsToCents(Number(amount));
  }

  let dispatch = createEventDispatcher();
</script>

<div class="invoice-line-item border-b-2 border-fog py-2">
  <div>
    <input class="line-item" type="text" name="description" bind:value={lineItem.description} />
  </div>

  <!-- Также при помощи события смены фокуса "on:blur" мы сделаем так, что значение переформатируется в доллары и центы после точки. -->
  <div>
    <input
      bind:value={unitPrice}
      on:blur={() => (unitPrice = twoDecimals(Number(unitPrice)))}
      class="line-item text-right"
      type="number"
      name="unitPrice"
      step="0.01"
      min="0"
    />
  </div>

  <div>
    <input
      bind:value={lineItem.quantity}
      class="line-item text-center"
      type="number"
      name="quantity"
      min="0"
    />
  </div>

  <!-- Это поле у нас будет недоступным для ручного ввода и будет вычисляться автоматически. -->
  <div>
    <input
      bind:value={amount}
      disabled
      class="line-item text-right"
      type="number"
      name="amount"
      step="0.01"
      min="0"
    />
  </div>

  <div>
    {#if canDelete}
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

  input[type='text']:disabled,
  input[type='number']:disabled {
    @apply border-b-0 bg-transparent px-0;
  }
</style>
