<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { v4 as uuidv4 } from 'uuid';
  import { addInvoice, updateInvoice } from '$lib/stores/InvoiceStore';
  import { addClient, clients, loadClients } from '$lib/stores/ClientStore';
  import { states } from '$lib/utils/states';
  import { today } from '$lib/utils/dateHelpers';
  import Button from '$lib/components/Button.svelte';
  import Trash from '$lib/components/Icon/Trash.svelte';
  import LineItemRows from './LineItemRows.svelte';
  import ConfirmDelete from './ConfirmDelete.svelte';

  const blankLineItem = {
    id: uuidv4(),
    description: '',
    quantity: 0,
    amount: 0
  };

  let isNewClient: boolean = false;
  export let invoice: Invoice = {
    client: {} as Client,
    lineItems: [{ ...blankLineItem }] as LineItem[]
  } as Invoice;

  let newClient: Partial<Client> = {};

  export let formState: 'create' | 'edit' = 'create';

  export let closePanel: () => void = () => {};

  let isModalShowing: boolean = false;

  const initialDiscount = invoice.discount || 0;

  export const AddLineItem = () => {
    invoice.lineItems = [...(invoice.lineItems as []), { ...blankLineItem, id: uuidv4() }];
  };

  const RemoveLineItem = (event: CustomEvent) => {
    invoice.lineItems =
      invoice?.lineItems && invoice.lineItems.filter((item) => item.id !== event.detail);
    console.log('remove line item');
  };

  const UpdateLineItem = () => {
    invoice.lineItems = invoice.lineItems;
  };

  // 86.11.1 Итак, в функцию "handleSubmit" перед выполнением нужно добавить "await", а сама функцию тогда у нас станет асинхронной. А также мы удалим запуск метода Snackbar "send", т.к. мы уже делаем это в хранилище. То же исправление сделаем и для [src\routes\(dashboard)\clients\ClientForm.svelte].
  // Go to [src\routes\(dashboard)\invoices\[id]\+page.svelte]
  // 86.13 Следующая вещь, что нужно исправить: пока что мы вызывали функцию "handleSubmit" всякий раз, когда пользователь сохранял изменения. И в его части, где если isNewClient в значении true, то добавляется новый клиент и нам нужно добавит этой функции "await".
  // Go to [src\lib\stores\InvoiceStore.ts]
  // 86.15.0 Устраняем очередной баг, на этот раз, если в форме редакции инвойса нажать кнопку + Client и создать нового клиента, а потом сохранить инвойс, то он сохранится, как и новый клиент, но при этом этот новый инвойс будет за именем старого клиента. Это происходит потому, что у нас пока нигде не передаётся id нового клиента сюда. Исправим это.
  // Go to [src\lib\stores\ClientStore.ts]
  // 86.15.2 Теперь нам нужно поместить эту информацию о id, которую возвращает функция "addClient", т.ч. присвоим выполнение функции в константу "addedClient". А дальше мы будем обновлять invoice.client.id айдишником, который получили результатом выполнения функции "addClient".
  const handleSubmit = async () => {
    if (isNewClient) {
      invoice.client = newClient as Client;
      const addedClient = await addClient(newClient as Client);
      invoice.client.id = addedClient?.id;
    }

    if (formState === 'create') {
      addInvoice(invoice);
    } else {
      await updateInvoice(invoice);
      /* snackbar.send({
        message: 'Your invoice was successfully updated.',
        type: 'success'
      }); */
    }

    closePanel();
  };

  const UpdateDiscount = (event: CustomEvent) => (invoice.discount = event.detail.discount);

  onMount(() => {
    loadClients();
  });
</script>

<h2 class="mb-7 font-sansSerif text-3xl font-bold text-daisyBush">
  {#if formState === 'create'}Add{:else}Edit{/if} an Invoice
</h2>

<form class="grid grid-cols-6 gap-x-5" on:submit|preventDefault={handleSubmit}>
  <!-- client -->
  <div class="field col-span-6 md:col-span-4">
    {#if !isNewClient}
      <label for="client">Client</label>
      <div
        class="flex flex-wrap items-end justify-center gap-x-5 sm:flex-nowrap sm:justify-start md:gap-x-5"
      >
        <select
          id="client"
          class="mb-4 sm:mb-0"
          name="client"
          required={!isNewClient}
          bind:value={invoice.client.id}
          on:change={() => {
            const selectedClient = $clients.find((client) => client.id === invoice.client.id);
            invoice.client.name = selectedClient?.name !== undefined ? selectedClient.name : '';
          }}
        >
          <option />
          {#each $clients as client}
            <option value={client.id}>{client.name}</option>
          {/each}
        </select>
        <div class="text-base font-bold leading-[2.6rem] text-monsoon lg:leading-[3.5rem]">or</div>
        <div class="self-center">
          <Button
            label="+ Client"
            onClick={() => {
              isNewClient = true;
              invoice.client.name = '';
              invoice.client.email = '';
            }}
            style="outline"
            isAnimated={false}
          />
        </div>
      </div>
    {:else}
      <label for="newClient">New Client</label>
      <div class="flex flex-wrap items-end gap-x-2 sm:flex-nowrap md:gap-x-5">
        <input
          class="mb-4 sm:mb-0"
          type="text"
          name="newClient"
          required={isNewClient}
          bind:value={newClient.name}
        />
        <div class="text-base font-bold leading-[2.6rem] text-monsoon lg:leading-[3.5rem]">or</div>
        <div class="self-center">
          <Button
            label="Existing Client"
            onClick={() => {
              isNewClient = false;
              newClient = {};
            }}
            style="outline"
            isAnimated={false}
          />
        </div>
      </div>
    {/if}
  </div>

  <!-- invoice id -->
  <div class="field col-span-6 row-start-1 md:col-span-2 md:row-start-auto">
    <label for="invoiceNumber">Invoice ID</label>
    <input
      class="mt-0.5"
      type="number"
      name="invoiceNumber"
      required
      bind:value={invoice.invoiceNumber}
    />
  </div>

  <!-- new client -->
  {#if isNewClient}
    <div class="field col-span-6 grid gap-x-5" transition:slide>
      <div class="field col-span-6">
        <label for="email"> Client's email </label>
        <input
          type="email"
          name="email"
          id="email"
          required={isNewClient}
          bind:value={newClient.email}
        />
      </div>

      <div class="field col-span-6">
        <label for="street">Street</label>
        <input type="text" name="street" id="street" bind:value={newClient.street} />
      </div>

      <div class="field col-span-2">
        <label for="city">City</label>
        <input type="text" name="city" id="city" bind:value={newClient.city} />
      </div>

      <div class="field col-span-2">
        <label for="state">State</label>
        <select name="state" id="state" bind:value={newClient.state}>
          <option />
          {#each states as state}
            <option value={state.value}>{state.name}</option>
          {/each}
        </select>
      </div>

      <div class="field col-span-2">
        <label for="zip">Zip</label>
        <input type="text" name="zip" id="zip" minlength="5" bind:value={newClient.zip} />
      </div>
    </div>
  {/if}

  <!-- due date -->
  <div class="field col-span-3 sm:col-span-2">
    <label for="dueDate">Due Date</label>
    <input type="date" name="dueDate" min={today} required bind:value={invoice.dueDate} />
  </div>

  <!-- issue date -->
  <div class="field  col-span-3 sm:col-span-2 sm:col-start-5">
    <label for="issueDate">Issue Date</label>
    <input type="date" name="issueDate" min={today} bind:value={invoice.issueDate} />
  </div>

  <!-- subject -->
  <div class="field col-span-6">
    <label for="subject">Subject</label>
    <input type="text" name="subject" bind:value={invoice.subject} />
  </div>

  <!-- line items -->
  <div class="field col-span-6">
    <LineItemRows
      discount={initialDiscount}
      lineItems={invoice.lineItems}
      on:addLineItem={AddLineItem}
      on:removeLineItem={RemoveLineItem}
      on:updateLineItem={UpdateLineItem}
      on:updateDiscount={UpdateDiscount}
    />
  </div>

  <!-- notes -->
  <div class="field col-span-6">
    <label for="notes"
      >Notes <span class="font-normal">(optional, displayed on invoice)</span></label
    >
    <textarea name="notes" id="notes" bind:value={invoice.notes} />
  </div>

  <!-- terms -->
  <div class="field col-span-6">
    <label for="terms"
      >Terms <span class="font-normal">(optional, enter your terms and conditions)</span></label
    >
    <textarea name="terms" id="terms" bind:value={invoice.terms} />
    <div class="text-xs text-gray-400">
      Formatting tips: <strong>*bold*</strong>, <em>_italics_</em>.
    </div>
  </div>

  <!-- buttons -->
  <div class="field col-span-2">
    {#if formState === 'edit'}
      <Button
        style="textOnlyDestructive"
        label="Delete"
        isAnimated={false}
        onClick={() => (isModalShowing = true)}
        iconLeft={Trash}
      />
    {/if}
  </div>
  <div class="field col-span-4 flex justify-end gap-x-5">
    <Button
      label="Cancel"
      style="secondary"
      isAnimated={false}
      onClick={() => {
        closePanel();
      }}
    />
    <button
      class="button translate-y-0 bg-lavenderIndigo text-white shadow-colored transition-all hover:-translate-y-2 hover:shadow-coloredHover"
      type="submit">Save</button
    >
  </div>
</form>

<ConfirmDelete
  {invoice}
  {isModalShowing}
  on:close={() => {
    isModalShowing = false;
    closePanel();
  }}
/>
