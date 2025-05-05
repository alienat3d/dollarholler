<script lang="ts">
  import { clickOutside } from '$lib/actions/ClickOutside';
  import { swipe } from '$lib/actions/Swipe';
  import { convertDate, isLate } from '$lib/utils/dateHelpers';
  import { centsToDollars, invoiceTotal } from '$lib/utils/moneyHelpers';
  import Send from '$lib/components/Icon/Send.svelte';
  import Edit from '$lib/components/Icon/Edit.svelte';
  import ThreeDots from '$lib/components/Icon/ThreeDots.svelte';
  import View from '$lib/components/Icon/View.svelte';
  import Cancel from '$lib/components/Icon/Cancel.svelte';
  import Trash from '$lib/components/Icon/Trash.svelte';
  import AdditionalOptions from '$lib/components/AdditionalOptions.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import SlidePanel from '$lib/components/SlidePanel.svelte';
  import InvoiceForm from './InvoiceForm.svelte';
  import ConfirmDelete from './ConfirmDelete.svelte';

  export let invoice: Invoice;
  let isAdditionalMenuShowing = false;
  let isOptionsDisabled = false;
  let isModalShowing = false;
  let isInvoiceFormShowing = false;
  // * 68.0.0 Теперь займёмся кнопкой "Cancel" в моб. версиях приложения, по нажатию на которую нам нужно возвращать строку инвойса назад на своё место. Для этого создадим переменную triggerReset. ↓
  let triggerReset = false;

  const handleDelete = () => {
    isModalShowing = true;
    isAdditionalMenuShowing = false;
  };

  const handleEdit = () => {
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

<!-- 68.0.1 Теперь в экшен "swipe" поместим эту переменную. -->
<!-- Go to [src\lib\actions\Swipe.ts] -->
<!-- 68.5 Теперь нам нужно поставить слушатель кастомного события на тот же элемент, где у нас use:swipe, чтобы по его срабатыванию переключать значение resetTrigger в false. -->
<!-- Go to [src\lib\actions\Swipe.ts] -->
<div class="relative">
  <div
    class="invoice-table invoice-row relative z-row items-center rounded-lg bg-white py-3 shadow-tableRow lg:py-6"
    use:swipe={{ triggerReset }}
    on:outOfView={() => (triggerReset = false)}
  >
    <div class="status"><Tag className="ml-auto lg:ml-0" label={getInvoiceLabel()} /></div>
    <div class="dueDate text-sm lg:text-lg">{convertDate(invoice.dueDate)}</div>
    <div class="invoiceNumber text-sm lg:text-lg">{invoice.invoiceNumber}</div>
    <div class="clientName truncate whitespace-nowrap text-base font-bold lg:text-xl">
      {invoice.client.name}
    </div>
    <div class="amount text-right font-mono text-sm font-bold lg:text-lg">
      ${centsToDollars(invoiceTotal(invoice.lineItems, invoice.discount))}
    </div>
    <div class="viewButton hidden items-center justify-center text-sm lg:flex lg:text-lg">
      <a href={`/invoices/${invoice.id}`} class="text-pastelPurple hover:text-daisyBush"><View /></a
      >
    </div>
    <div
      class="moreButton relative hidden items-center justify-center text-sm lg:flex lg:text-lg"
      use:clickOutside={() => (isAdditionalMenuShowing = false)}
    >
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

  <!-- 68.3 А здесь на событие клика по кнопке "Cancel" будем устанавливать triggerReset в положение true. Изменение параметра запустит "update" в [src\lib\actions\Swipe.ts] экшене и т.о. инвойс-элемент вернётся на своё место. -->
  <!-- Go to [src\lib\actions\Swipe.ts] -->
  <!-- swipe to reveal -->
  <div class="absolute inset-0 z-rowActions flex h-full w-full items-center justify-around">
    <button class="action-button center" on:click={() => (triggerReset = true)}
      ><Cancel width={32} height={32} />Cancel</button
    >
    {#if !isOptionsDisabled}
      <button class="action-button center" on:click={handleEdit}
        ><Edit width={32} height={32} />Edit</button
      >
      <button class="action-button center" on:click={handleSendInvoice}
        ><Send width={32} height={32} />Send</button
      >
    {/if}
    <button class="action-button center" on:click={handleDelete}
      ><Trash width={32} height={32} />Delete</button
    >
    <a class="action-button center" href={`/invoices/${invoice.id}`}
      ><View width={32} height={32} />View</a
    >
  </div>
</div>

<ConfirmDelete {invoice} {isModalShowing} on:close={() => (isModalShowing = false)} />

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
  .action-button {
    @apply cursor-pointer flex-col font-bold text-daisyBush;
  }

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
