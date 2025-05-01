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

  export let client: Client;

  //  52.1 С помощью "console.log" посмотрим, что за данные мы получаем в объекте "client" и увидим, что действительно у каждого клиента есть массив "invoices", который мы можем использовать для заполнения граф "received" & "balance".
  // console.log({ client });

  let isAdditionalMenuShowing = false;

  // 52.2.0 Нам понадобятся две функции для получения значений для "receivedInvoices" и "balance".
  const receivedInvoices = () => {
    // 52.2.1 Находим оплаченные инвойсы. Отфильтруем всех инвойсы, которые нам подходят сюда, т.е. со статусом "paid". Также может быть, что client.invoices недоступны по какой-то причине и TS предупреждает нас ошибкой, что нужно сделать доп. проверку и если инвойсов нет, то просто вернём 0.
    if (client?.invoices) {
      const paidInvoices = client.invoices.filter((invoice) => invoice.invoiceStatus === 'paid');

      // 52.2.2 Получаем их сумму. Возьмём функцию-помощник "sumInvoices", чтобы сложить инвойсы между собой и поместим туда найденные выше оплаченные инвойсы. ↓
      return sumInvoices(paidInvoices);
    }

    return 0;
  };

  // 52.3.0 Вообще сюда мы можем скопировать почти всё из функции "receivedInvoices" за исключением того, что теперь у нас фильтр будет не равен "paid". ↓
  const balanceInvoices = () => {
    if (client?.invoices) {
      const paidInvoices = client.invoices.filter((invoice) => invoice.invoiceStatus !== 'paid');

      return sumInvoices(paidInvoices);
    }

    return 0;
  };
</script>

<div class="client-table client-row rounded-lg bg-white py-3 shadow-tableRow lg:py-6">
  <div class="status"><Tag className="ml-auto" label={client.clientStatus} /></div>
  <div class="client-name truncate whitespace-nowrap text-base font-bold lg:text-xl">
    {client.name}
  </div>
  <!-- 52.2.3 Ну и вставим результат нашей новой функции сюда, однако нам нужен результат в долларах, т.ч. обернём дополнительно в функцию-помощник "centsToDollars" -->
  <div class="received text-right font-mono text-sm font-bold lg:text-lg">
    ${centsToDollars(receivedInvoices())}
  </div>
  <!-- 52.3.1 И также вставим выполнение этой функции сюда -->
  <div class="balance text-right font-mono text-sm font-bold text-scarlet lg:text-lg">
    ${centsToDollars(balanceInvoices())}
  </div>
  <div class="view relative hidden items-center justify-center lg:flex">
    <a class="hover:daisyBush text-pastelPurple transition-colors" href="#"><View /></a>
  </div>
  <div class="three-dots relative hidden items-center justify-center lg:flex">
    <button
      class="hover:daisyBush text-pastelPurple transition-colors"
      on:click={() => (isAdditionalMenuShowing = !isAdditionalMenuShowing)}><ThreeDots /></button
    >
    {#if isAdditionalMenuShowing}
      <AdditionalOptions
        options={[
          { label: 'Edit', icon: Edit, onClick: () => console.log('editing'), disabled: false },
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
