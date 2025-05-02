<script lang="ts">
  import { centsToDollars, sumInvoices } from '$lib/utils/moneyHelpers';
  import View from '$lib/components/Icon/View.svelte';
  import ThreeDots from '$lib/components/Icon/ThreeDots.svelte';
  import Edit from '$lib/components/Icon/Edit.svelte';
  import Trash from '$lib/components/Icon/Trash.svelte';
  import Activate from '$lib/components/Icon/Activate.svelte';
  import Archive from '$lib/components/Icon/Archive.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import AdditionalOptions from '$lib/components/AdditionalOptions.svelte';
  import SlidePanel from '$lib/components/SlidePanel.svelte';
  import ClientForm from './ClientForm.svelte';

  export let client: Client;

  let isAdditionalMenuShowing: boolean = false;

  // 55.4.1 А также переменную с состоянием панели.
  let isClientFormShowing: boolean = false;

  const receivedInvoices = () => {
    if (client?.invoices) {
      const paidInvoices = client.invoices.filter((invoice) => invoice.invoiceStatus === 'paid');

      return sumInvoices(paidInvoices);
    }

    return 0;
  };

  const balanceInvoices = () => {
    if (client?.invoices) {
      const paidInvoices = client.invoices.filter((invoice) => invoice.invoiceStatus !== 'paid');

      return sumInvoices(paidInvoices);
    }

    return 0;
  };

  // 55.4.2 И собственно саму скрывающую панель функцию. ↓
  const closePanel = () => (isClientFormShowing = false);

  // 55.5.1 Создадим эту функцию, которая будет открывать панель формы клиента и также переключать её в положение "edit".
  const handleEdit = () => {
    isClientFormShowing = true;
    isAdditionalMenuShowing = false;
  };
</script>

<div class="client-table client-row rounded-lg bg-white py-3 shadow-tableRow lg:py-6">
  <div class="status"><Tag className="ml-auto" label={client.clientStatus} /></div>
  <div class="client-name truncate whitespace-nowrap text-base font-bold lg:text-xl">
    {client.name}
  </div>
  <div class="received text-right font-mono text-sm font-bold lg:text-lg">
    ${centsToDollars(receivedInvoices())}
  </div>
  <div class="balance text-right font-mono text-sm font-bold text-scarlet lg:text-lg">
    ${centsToDollars(balanceInvoices())}
  </div>
  <div class="view relative hidden items-center justify-center lg:flex">
    <a class="hover:daisyBush text-pastelPurple transition-colors" href="#"><View /></a>
  </div>
  <div class="three-dots relative hidden items-center justify-center lg:flex">
    <!-- 55.5.0 В выпадающем меню сделаем, чтобы по клику на кнопку "edit" запускалась функция "handleEdit". ↑ -->
    <button
      class="hover:daisyBush text-pastelPurple transition-colors"
      on:click={() => (isAdditionalMenuShowing = !isAdditionalMenuShowing)}><ThreeDots /></button
    >
    {#if isAdditionalMenuShowing}
      <AdditionalOptions
        options={[
          { label: 'Edit', icon: Edit, onClick: handleEdit, disabled: false },
          {
            label: 'Activate',
            icon: Activate,
            onClick: () => {
              client.clientStatus = 'active';
              isAdditionalMenuShowing = false;
            },
            disabled: client.clientStatus === 'active'
          },
          {
            label: 'Archive',
            icon: Archive,
            onClick: () => {
              client.clientStatus = 'archive';
              isAdditionalMenuShowing = false;
            },
            disabled: client.clientStatus === 'archive'
          },
          { label: 'Delete', icon: Trash, onClick: () => console.log('deleting'), disabled: false }
        ]}
      />
    {/if}
  </div>
</div>

<!-- 55.4.0 Добавим сюда логику скрытия панели с формой. А также нам нужно передать в комп. ClientForm состояние формы "edit" и передать объект "client" для заполнения формы данными при редактировании клиента. -->
{#if isClientFormShowing}
  <SlidePanel on:closePanel={closePanel}>
    <ClientForm {closePanel} formState="edit" {client} />
  </SlidePanel>
{/if}

<style lang="postcss">
  .client-row {
    grid-template-areas: 'clientName status' 'received balance';
  }

  @media (min-width: 1024px) {
    .client-row {
      grid-template-areas: 'status clientName received balance view threeDots';
    }
  }

  .client-name {
    grid-area: clientName;
  }

  .status {
    grid-area: status;
  }

  .received {
    @apply text-left lg:text-right;
    grid-area: received;
  }
  .received::before {
    @apply block text-xs font-bold lg:hidden;
    content: 'Received: ';
  }

  .balance {
    grid-area: balance;
  }
  .balance::before {
    @apply block text-xs font-bold lg:hidden;
    content: 'Balance: ';
  }

  .view {
    grid-area: view;
  }

  .three-dots {
    grid-area: threeDots;
  }
</style>
