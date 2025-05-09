<script lang="ts">
  import { clickOutside } from '$lib/actions/ClickOutside';
  import { swipe } from '$lib/actions/Swipe';
  import { centsToDollars, sumInvoices } from '$lib/utils/moneyHelpers';
  import View from '$lib/components/Icon/View.svelte';
  import ThreeDots from '$lib/components/Icon/ThreeDots.svelte';
  import Edit from '$lib/components/Icon/Edit.svelte';
  import Trash from '$lib/components/Icon/Trash.svelte';
  import Activate from '$lib/components/Icon/Activate.svelte';
  import Archive from '$lib/components/Icon/Archive.svelte';
  import Cancel from '$lib/components/Icon/Cancel.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import AdditionalOptions from '$lib/components/AdditionalOptions.svelte';
  import SlidePanel from '$lib/components/SlidePanel.svelte';
  import ClientForm from './ClientForm.svelte';

  export let client: Client;

  let triggerReset: boolean = false;
  let isAdditionalMenuShowing: boolean = false;
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

  const closePanel = () => (isClientFormShowing = false);

  const handleEdit = () => {
    isClientFormShowing = true;
    isAdditionalMenuShowing = false;
  };

  // 71.2 Также понадобится создать ещё пару функций для архивации, активации и удаления клиентов.
  const handleArchiveClient = () => {
    client.clientStatus = 'archive';
    isAdditionalMenuShowing = false;
  };

  const handleActivateClient = () => {
    client.clientStatus = 'active';
    isAdditionalMenuShowing = false;
  };

  const handleDeleteClient = () => {
    console.log('deleting');
  };
</script>

<!-- * 71.0 Теперь по образу и подобию мы прикрутим наш "swipe" экшен и к странице со списком инвойсов. ↓ -->
<!-- 71.3 Для абсолютного позиционирования кнопок меню нам понадобится обёртка с классом "relative", которая будет их родительским тегом. -->
<div class="relative">
  <div
    class="client-table client-row relative z-row rounded-lg bg-white py-3 shadow-tableRow lg:py-6"
    use:swipe={{ triggerReset }}
    on:outOfView={() => (triggerReset = false)}
  >
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
      <a class="hover:daisyBush text-pastelPurple transition-colors" href={`/clients/${client.id}`}>
        <View />
      </a>
    </div>
    <div
      class="three-dots relative hidden items-center justify-center lg:flex"
      use:clickOutside={() => (isAdditionalMenuShowing = false)}
    >
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
              onClick: handleActivateClient,
              disabled: client.clientStatus === 'active'
            },
            {
              label: 'Archive',
              icon: Archive,
              onClick: handleArchiveClient,
              disabled: client.clientStatus === 'archive'
            },
            { label: 'Delete', icon: Trash, onClick: handleDeleteClient, disabled: false }
          ]}
        />
      {/if}
    </div>
  </div>

  <!-- 71.1 Скопируем кнопки из [src\routes\(dashboard)\invoices\InvoiceRow.svelte] и отредактируем их по список клиентов. ↑ -->
  <!-- swipe to reveal -->
  <div class="swipe-revealed-actions">
    <button class="action-button center" on:click={() => (triggerReset = true)}
      ><Cancel width={32} height={32} />Cancel</button
    >
    <button class="action-button center" on:click={handleEdit}
      ><Edit width={32} height={32} />Edit</button
    >
    {#if client.clientStatus === 'active'}
      <button class="action-button center" on:click={handleArchiveClient}
        ><Archive width={32} height={32} />Archive</button
      >
    {/if}
    {#if client.clientStatus === 'archive'}
      <button class="action-button center" on:click={handleActivateClient}
        ><Activate width={32} height={32} />Activate</button
      >
    {/if}
    <button class="action-button center" on:click={handleDeleteClient}
      ><Trash width={32} height={32} />Delete</button
    >
    <a class="action-button center" href={`/clients/${client.id}`}
      ><View width={32} height={32} />View</a
    >
  </div>
</div>

<!-- slide panel -->
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
