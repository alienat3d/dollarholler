<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { deleteInvoice } from '$lib/stores/InvoiceStore';
  import { centsToDollars, sumLineItems } from '$lib/utils/moneyHelpers';
  import { createEventDispatcher } from 'svelte';

  export let invoice: Invoice;
  export let isModalShowing: boolean = false;

  // 35.10.1 Создаём константу dispatch, куда помещаем метод Svelte createEventDispatcher.
  const dispatch = createEventDispatcher();
</script>

<!-- 35.9.0 Мы вырежем из [src\routes\(dashboard)\invoices\InvoiceRow.svelte] этот кусочек кода модального окна и вставим в новый компонент, а затем пофиксим ошибки импортируя сюда, что ему нужно. -->
<!-- Go to [src\routes\(dashboard)\invoices\InvoiceRow.svelte] -->
<!-- 35.10.0 Но прежде, чем мы попадём в ситуацию, когда приложение рассинхронизировалось, когда, например, мы указываем в "onClick" isModalShowing напрямую. Лучше мы используем dispatch и будем передавать событие "close". Просто оставим "on:close", т.к. событие "close" вызывается на доп. уровне в комп. Modal. -->
<!-- <Modal isVisible={isModalShowing} on:close={() => (isModalShowing = false)}> -->
<Modal isVisible={isModalShowing} on:close>
  <div class="flex h-full min-h-[175px] flex-col items-center justify-between gap-6">
    <div class="text-center text-xl font-bold text-daisyBush">
      Are you sure you want to delete this invoice to
      <span class="text-scarlet">{invoice.client.name}</span> for
      <span class="text-scarlet">${centsToDollars(sumLineItems(invoice.lineItems))}</span>?
    </div>
    <div class="flex gap-4">
      <!-- 35.10.2 Также и здесь мы будем использовать dispatch с указанным в нём событием "close". -->
      <Button
        isAnimated={false}
        label="Cancel"
        onClick={() => dispatch('close')}
        style="secondary"
      />
      <!-- 35.10.3 А также и здесь тоже. -->
      <!-- Go to [src\routes\(dashboard)\invoices\InvoiceRow.svelte] -->
      <Button
        isAnimated={false}
        label="Yes, Delete It"
        onClick={() => {
          deleteInvoice(invoice);
          dispatch('close');
        }}
        style="destructive"
      />
    </div>
  </div>
</Modal>
