<script lang="ts">
  import { convertDate, isLate } from '$lib/utils/dateHelpers';
  import { sumLineItems, centsToDollars } from '$lib/utils/moneyHelpers';
  import AdditionalOptions from '$lib/components/AdditionalOptions.svelte';
  import ThreeDots from '$lib/components/Icon/ThreeDots.svelte';
  import View from '$lib/components/Icon/View.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Send from '$lib/components/Icon/Send.svelte';
  import Trash from '$lib/components/Icon/Trash.svelte';
  import Edit from '$lib/components/Icon/Edit.svelte';
  import SlidePanel from '$lib/components/SlidePanel.svelte';
  import InvoiceForm from './InvoiceForm.svelte';
  import ConfirmDelete from './ConfirmDelete.svelte';

  export let invoice: Invoice;
  let isAdditionalMenuShowing = false;
  let isOptionsDisabled = false;
  let isModalShowing = false;
  let isInvoiceFormShowing = false;

  const handleDelete = () => {
    isModalShowing = true;
    isAdditionalMenuShowing = false;
    console.log('deleting');
  };
  // 35.1 Добавим по клику на кнопку "Edit", чтобы панель формы показывалась. А также нужно скрывать меню, как только мы нажмём на неё. ↓
  const handleEdit = () => {
    console.log('editing');
    isInvoiceFormShowing = true;
    isAdditionalMenuShowing = false;
  };
  const handleSendInvoice = () => {
    console.log('sending');
  };

  const getInvoiceLabel = () => {
    if (invoice.invoiceStatus === 'draft') {
      return 'draft';
    } else if (invoice.invoiceStatus === 'sent' && !isLate(invoice.dueDate)) {
      isOptionsDisabled = true;
      return 'sent';
    } else if (invoice.invoiceStatus === 'sent' && isLate(invoice.dueDate)) {
      isOptionsDisabled = true;
      return 'late';
    } else if (invoice.invoiceStatus === 'paid') {
      isOptionsDisabled = true;
      return 'paid';
    }
  };
</script>

<div
  class="invoice-table invoice-row items-center rounded-lg bg-white py-3 shadow-tableRow lg:py-6"
>
  <div class="status"><Tag className="ml-auto lg:ml-0" label={getInvoiceLabel()} /></div>
  <div class="dueDate text-sm lg:text-lg">{convertDate(invoice.dueDate)}</div>
  <div class="invoiceNumber text-sm lg:text-lg">{invoice.invoiceNumber}</div>
  <div class="clientName truncate whitespace-nowrap text-base font-bold lg:text-xl">
    {invoice.client.name}
  </div>
  <div class="amount text-right font-mono text-sm font-bold lg:text-lg">
    ${centsToDollars(sumLineItems(invoice.lineItems))}
  </div>
  <div class="center viewButton hidden text-sm lg:flex lg:text-lg">
    <a href="#" class="text-pastelPurple hover:text-daisyBush"><View /></a>
  </div>
  <div class="center moreButton relative hidden text-sm lg:flex lg:text-lg">
    <button
      class=" text-pastelPurple hover:text-daisyBush"
      on:click={() => {
        isAdditionalMenuShowing = !isAdditionalMenuShowing;
      }}><ThreeDots /></button
    >
    {#if isAdditionalMenuShowing}
      <AdditionalOptions
        options={[
          { label: 'Edit', icon: Edit, onClick: handleEdit, disabled: isOptionsDisabled },
          { label: 'Delete', icon: Trash, onClick: handleDelete, disabled: false },
          { label: 'Send', icon: Send, onClick: handleSendInvoice, disabled: isOptionsDisabled }
        ]}
      />
    {/if}
  </div>
</div>

<!-- 35.9.1 И теперь на место, где было модальное окно мы вставим комп. модального окна ConfirmDelete. Добавим в него invoice, а также isModalShowing. -->
<!-- Go to [src\routes\(dashboard)\invoices\ConfirmDelete.svelte] -->
<!-- 35.11 А здесь мы слушаем событие, которые создали диспатчером, т.е. "close" и здесь мы уже будем менять значение "isModalShowing". -->
<!-- Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte] -->
<ConfirmDelete {invoice} {isModalShowing} on:close={() => (isModalShowing = false)} />

<!-- * 35.0 Итак, теперь оживим кнопку "Edit", точнее, чтобы по клику на неё была возможность редактировать каждый уже созданный ранее инвойс. И для начала скопируем часть "slide panel" из [src\routes\(dashboard)\invoices\+page.svelte] сюда и поправим ошибки. ↑ -->
<!-- 35.2 Также в InvoiceForm комп. нам нужно передавать данные из того инвойса, по которому мы кликнули кнопку "Edit", чтобы заполнить ими форму для редактирования. И у нас уже создан проп invoice, т.ч. можно его просто туда передать. -->
<!-- Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte] -->
<!-- 35.4.1 Также добавим теперь formState, что он должен быть в значении "edit". -->
<!-- Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte] -->
<!-- slide panel -->
{#if isInvoiceFormShowing}
  <SlidePanel
    on:closePanel={() => {
      isInvoiceFormShowing = false;
    }}
  >
    <InvoiceForm {invoice} formState="edit" closePanel={() => (isInvoiceFormShowing = false)} />
  </SlidePanel>
{/if}

<style lang="postcss">
  .invoice-row {
    grid-template-areas:
      'invoiceNumber invoiceNumber'
      'clientName amount'
      'dueDate status';
  }

  @media (min-width: 1024px) {
    .invoice-row {
      grid-template-areas: 'status dueDate invoiceNumber clientName amount viewButton moreButton';
    }
  }

  .invoice-row .status {
    grid-area: status;
  }

  .invoice-row .dueDate {
    grid-area: dueDate;
  }

  .invoice-row .invoiceNumber {
    grid-area: invoiceNumber;
  }

  .invoice-row .clientName {
    grid-area: clientName;
  }

  .invoice-row .amount {
    grid-area: amount;
  }

  .invoice-row .viewButton {
    grid-area: viewButton;
  }

  .invoice-row .moreButton {
    grid-area: moreButton;
  }
</style>
