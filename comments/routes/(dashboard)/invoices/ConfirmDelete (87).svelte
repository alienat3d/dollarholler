<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { deleteInvoice } from '$lib/stores/InvoiceStore';
  import { centsToDollars, sumLineItems } from '$lib/utils/moneyHelpers';
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';

  export let invoice: Invoice;
  export let isModalShowing: boolean = false;

  // 87.6.1 Т.ч. перенесём в отдельную функцию "handleDelete" для наглядности. Отправление сообщение снекбара нам уже не понадобятся, т.к. мы это уже реализуем через хранилище и важно сохранять постоянность логики кода.
  const handleDelete = async () => {
    await deleteInvoice(invoice);
    dispatch('close');
    /* snackbar.send({
      message: 'Your invoice was successfully deleted.',
      type: 'success'
    }); */
  };

  const dispatch = createEventDispatcher();
</script>

<Modal isVisible={isModalShowing} on:close>
  <div class="flex h-full min-h-[175px] flex-col items-center justify-between gap-6">
    <div class="text-center text-xl font-bold text-daisyBush">
      Are you sure you want to delete this invoice to
      <span class="text-scarlet">{invoice.client.name}</span> for
      <span class="text-scarlet">${centsToDollars(sumLineItems(invoice.lineItems))}</span>?
    </div>
    <div class="flex gap-4">
      <Button
        isAnimated={false}
        label="Cancel"
        onClick={() => dispatch('close')}
        style="secondary"
      />
      <!-- 87.6.0 Пришло время рефакторинга кнопки удаления, т.к. пока у нас тут было всё прописано инлайново, но с добавлений новых строк становится всё сложнее её поддерживать. ↑ -->
      <Button
        isAnimated={false}
        label="Yes, Delete It"
        onClick={handleDelete}
        style="destructive"
      />
    </div>
  </div>
</Modal>
