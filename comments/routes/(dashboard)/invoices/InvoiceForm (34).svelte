<script lang="ts">
  import { addClient, clients, loadClients } from '$lib/stores/ClientStore';
  import { slide } from 'svelte/transition';
  import { v4 as uuidv4 } from 'uuid';
  import LineItemRows from './LineItemRows.svelte';
  import Button from '$lib/components/Button.svelte';
  import Trash from '$lib/components/Icon/Trash.svelte';
  import { states } from '$lib/utils/states';
  import { onMount } from 'svelte';
  import { today } from '$lib/utils/dateHelpers';
  import { addInvoice } from '$lib/stores/InvoiceStore';

  const blankLineItem = {
    id: uuidv4(),
    description: '',
    quantity: 0,
    amount: 0
  };

  // let lineItems: LineItem[] = [{ ...blankLineItem }]; эта строчка нам больше не нужна, т.к. мы её поместили внутрь invoice.
  let isNewClient: boolean = false;
  // 34.1.1 Для этого создадим пустой объект invoice с типом Invoice. Внутри будет ещё один пустой объект client с типом Client, а также массив для записей инвойсов lineItems как тип массива LineItem.
  let invoice: Invoice = {
    client: {} as Client,
    lineItems: [{ ...blankLineItem }] as LineItem[]
  } as Invoice;

  // 34.2 Также мудрым решением будет собирать информацию о новом клиенте отдельно, т.к. в будущем мы будем работать с серверным API "Supabase", в котором это будут две разные таблицы данных.
  // 34.8.2 ... нужно поменять тип с "Client" на "Partial<Client>" и это исправит ошибку. Это слово "Partial" даёт TS понять, что newClient может не существовать, но всё таки он принадлежит типу Client. И также "as Client" на конце уже излишне.
  // Go to [src\global.d.ts]
  let newClient: Partial<Client> = {};

  // 34.16.1 Создадим проп closePanel, чтобы закрывать панель формы, когда инвойс создан. Т.к. мы знаем, что тип closePanel будет пустой функцией и поэтому мы пропишем ей такой тип и по умолчанию она также будет пустой функцией. ↓
  export let closePanel: () => void = () => {};

  export const AddLineItem = () => {
    invoice.lineItems = [...(invoice.lineItems as []), { ...blankLineItem, id: uuidv4() }];
  };

  // 34.5 Устраним здесь TS-ошибку, добавив событию тип "CustomEvent".
  // Go to [src\routes\(dashboard)\invoices\LineItemRows.svelte]
  const RemoveLineItem = (event: CustomEvent) => {
    invoice.lineItems =
      invoice?.lineItems && invoice.lineItems.filter((item) => item.id !== event.detail);
    console.log('remove line item');
  };

  const UpdateLineItem = () => {
    invoice.lineItems = invoice.lineItems;
  };

  // 34.1.0 Прежде чем писать логику для функции нам нужно место, куда будут попадать данные из заполненного инвойса. ↑
  // 34.4 Переходим обратно к функции заполнения пустого объекта данными из формы. И для начала протестируем console.log(), что мы вообще получаем нужные данные. ↑
  // 34.13 Теперь нам нужно просто добавить созданную в InvoiceStore.ts функцию "addInvoice" в функцию "handleSubmit".
  // Go to [src\lib\stores\ClientStore.ts]
  // 34.15 Также по условию, что если у нас isNewClient в значении true, т.е. выбрана опция создать нового клиента, то мы используем функцию добавления нового клиента в хранилище "addClient". А также нужно добавить информацию из объекта newClient в объект invoice.
  // Go to [src\routes\(dashboard)\invoices\+page.svelte]
  // 34.16.2 Также добавим в конце закрытие панели ↓.
  const handleSubmit = () => {
    // console.log({ invoice: invoice, newClient: newClient });
    // Или сокращённо просто:
    // console.log({ invoice, newClient });

    if (isNewClient) {
      invoice.client = newClient as Client;
      addClient(newClient as Client);
    }

    addInvoice(invoice);

    closePanel();
  };

  onMount(() => {
    loadClients();
  });
</script>

<h2 class="mb-7 font-sansSerif text-3xl font-bold text-daisyBush">Add an Invoice</h2>

<!-- * 34.0 Итак, теперь нам нужно сохранять данные, введённые в форму инвойса. Это можно делать либо на сервере, либо на клиентской стороне. Пока потренируемся со вторым. Создадим функцию handleSubmit, которая будет запускаться по событию "submit" с модификатором "preventDefault". ↑ -->
<form class="grid grid-cols-6 gap-x-5" on:submit|preventDefault={handleSubmit}>
  <!-- client -->
  <div class="field col-span-4">
    {#if !isNewClient}
      <label for="client">Client</label>
      <div class="flex items-end gap-x-5">
        <!-- 34.3.0 Здесь нам нужно привязать поле к нашему объекту, чтобы собирать данные id из него. -->
        <!-- 34.7 Также, выбирая id клиента нам нужно находить его в БД и помещать информацию о нём в selectedClient. Это удобно делать с помощью метода "find". А дальше мы обновим свойство "name" объекта "invoice" найденным именем клиента. -->
        <select
          name="client"
          id="client"
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
        <div class="text-base font-bold leading-[3.5rem] text-monsoon">or</div>
        <div class="mb-0.5">
          <!-- 34.8.0 Ещё у нас есть задачка очищать данные поля клиента, если мы нажимаем на кнопку, чтобы старые введённые данные не оставались. Например, если пользователь уже что-то выбрал (или начал вводить), но потом передумал и нажал на кнопку, нам нужно очищать старые данные. -->
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
      <div class="flex items-end gap-x-5">
        <!-- 34.3.1 Тоже самое и здесь, но уже для второго объекта "newClient". -->
        <input type="text" name="newClient" required={isNewClient} bind:value={newClient.name} />
        <div class="text-base font-bold leading-[3.5rem] text-monsoon">or</div>
        <div class="mb-0.5">
          <!-- 34.8.1 Тоже самое и для другой кнопки. И вот у нас появилась TS-ошибка напротив присваивания newClient пустого объекта, для её устранения... ↑ -->
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
  <div class="field col-span-2">
    <label for="invoiceNumber">Invoice ID</label>
    <!-- 34.3.2 Также здесь забиндим данные о номере инвойса для объекта invoice. -->
    <input type="number" name="invoiceNumber" required bind:value={invoice.invoiceNumber} />
  </div>

  <!-- new client -->
  {#if isNewClient}
    <div class="field col-span-6 grid gap-x-5" transition:slide>
      <div class="field col-span-6">
        <label for="email"> Client's email </label>
        <!-- 34.3.3 Также здесь для объекта newClient собираем байндом данны об эл. почте. -->
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
        <!-- 34.3.4 Тоже делаем и для улицы. -->
        <input type="text" name="street" id="street" bind:value={newClient.street} />
      </div>

      <div class="field col-span-2">
        <label for="city">City</label>
        <!-- 34.3.5 А также и для города. -->
        <input type="text" name="city" id="city" bind:value={newClient.city} />
      </div>

      <div class="field col-span-2">
        <label for="state">State</label>
        <!-- 34.3.6 И для штата. -->
        <select name="state" id="state" bind:value={newClient.state}>
          <option />
          {#each states as state}
            <option value={state.value}>{state.name}</option>
          {/each}
        </select>
      </div>

      <div class="field col-span-2">
        <label for="zip">Zip</label>
        <!-- 34.3.7 И для почт. индекса. -->
        <input type="text" name="zip" id="zip" bind:value={newClient.zip} />
      </div>
    </div>
  {/if}

  <!-- due date -->
  <div class="field col-span-2">
    <label for="dueDate">Due Date</label>
    <!-- 34.3.8 Здесь для объекта invoice нужно забиндить крайнюю дату выплат. -->
    <input type="date" name="dueDate" min={today} required bind:value={invoice.dueDate} />
  </div>

  <!-- issue date -->
  <div class="field col-span-2 col-start-5">
    <label for="issueDate">Issue Date</label>
    <!-- 34.3.9 Здесь для объекта invoice нужно забиндить дату создания инвойса. -->
    <input type="date" name="issueDate" min={today} bind:value={invoice.issueDate} />
  </div>

  <!-- subject -->
  <div class="field col-span-6">
    <label for="subject">Subject</label>
    <!-- 34.3.10 Забиндим и поле "Тема" для объекта invoice. -->
    <input type="text" name="subject" bind:value={invoice.subject} />
  </div>

  <!-- line items -->
  <!-- 34.3.11 Также и здесь "{lineItems}" видоизменилось в "lineItems={invoice.lineItems}", т.к. изначально это сокращение от "lineItems = {lineItems}", а содержимое lineItems у нас теперь внутри объекта invoice. -->
  <!-- 34.11 Добавим discount сюда. -->
  <!-- Go to [src\lib\stores\InvoiceStore.ts] -->
  <div class="field col-span-6">
    <LineItemRows
      discount={invoice.discount}
      lineItems={invoice.lineItems}
      on:addLineItem={AddLineItem}
      on:removeLineItem={RemoveLineItem}
      on:updateLineItem={UpdateLineItem}
    />
  </div>

  <!-- notes -->
  <div class="field col-span-6">
    <label for="notes"
      >Notes <span class="font-normal">(optional, displayed on invoice)</span></label
    >
    <!-- 34.3.12 Продолжаем увлекательный процесс байнда полей формы, в этот раз на очереди поле "Заметки". -->
    <textarea name="notes" id="notes" bind:value={invoice.notes} />
  </div>

  <!-- terms -->
  <div class="field col-span-6">
    <label for="terms"
      >Terms <span class="font-normal">(optional, enter your terms and conditions)</span></label
    >
    <!-- 34.3.13 Тоже самое делаем и с полем "Условия". ↑ -->
    <textarea name="terms" id="terms" bind:value={invoice.terms} />
    <div class="text-xs text-gray-400">
      Formatting tips: <strong>*bold*</strong>, <em>_italics_</em>.
    </div>
  </div>

  <!-- buttons -->
  <div class="field col-span-2">
    <Button
      style="textOnlyDestructive"
      label="Delete"
      isAnimated={false}
      onClick={() => {}}
      iconLeft={Trash}
    />
  </div>
  <div class="field col-span-4 flex justify-end gap-x-5">
    <!-- 34.16.3 А ещё нам нужно скрывать панель по клику по кнопке "Cancel" и потому мы подставим функцию closePanel в подготовленный слушатель события onClick. -->
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
