<script lang="ts">
  // 32.3.0 Импортируем свежесозданное хранилище...
  import { clients, loadClients } from '$lib/stores/ClientStore';
  import { slide } from 'svelte/transition';
  import { v4 as uuidv4 } from 'uuid';
  import LineItemRows from '../../../../src/routes/(dashboard)/invoices/LineItemRows.svelte';
  import Button from '$lib/components/Button.svelte';
  import Trash from '$lib/components/Icon/Trash.svelte';
  import { states } from '$lib/utils/states';
  import { onMount } from 'svelte';

  const blankLineItem = {
    id: uuidv4(),
    description: '',
    quantity: 0,
    amount: 0
  };

  let lineItems: LineItem[] = [{ ...blankLineItem }];
  let isNewClient: boolean = false;

  const AddLineItem = () => {
    lineItems = [...lineItems, { ...blankLineItem, id: uuidv4() }];
  };

  const RemoveLineItem = (event) => {
    lineItems = lineItems.filter((item) => item.id !== event.detail);
    console.log('remove line item');
  };

  const UpdateLineItem = () => {
    lineItems = lineItems;
  };

  // 32.3.1 ..., а затем используем его в жизненном цикле onMount
  onMount(() => {
    loadClients();
  });
</script>

<h2 class="mb-7 font-sansSerif text-3xl font-bold text-daisyBush">Add an Invoice</h2>

<form class="grid grid-cols-6 gap-x-5">
  <!-- client -->
  <div class="field col-span-4">
    {#if !isNewClient}
      <label for="client">Client</label>
      <div class="flex items-end gap-x-5">
        <select name="client" id="client">
          <!-- 32.4 Как и с американскими штатами в прошлом уроке используем цикл "each", чтобы распечатать всех имеющихся клиентов. -->
          {#each $clients as client}
            <option value={client.id}>{client.name}</option>
          {/each}
        </select>
        <div class="text-base font-bold leading-[3.5rem] text-monsoon">or</div>
        <div class="mb-0.5">
          <Button
            label="+ Client"
            onClick={() => {
              isNewClient = true;
            }}
            style="outline"
            isAnimated={false}
          />
        </div>
      </div>
    {:else}
      <label for="newClient">New Client</label>
      <div class="flex items-end gap-x-5">
        <input type="text" name="newClient" />
        <div class="text-base font-bold leading-[3.5rem] text-monsoon">or</div>
        <!-- <div class="mb-0.5"> -->
        <Button
          label="Existing Client"
          onClick={() => {
            isNewClient = false;
          }}
          style="outline"
          isAnimated={false}
        />
        <!-- </div> -->
      </div>
    {/if}
  </div>

  <!-- invoice id -->
  <div class="field col-span-2">
    <label for="id">Invoice ID</label>
    <input type="number" name="id" />
  </div>

  <!-- new client -->
  {#if isNewClient}
    <div class="field col-span-6 grid gap-x-5" transition:slide>
      <div class="field col-span-6">
        <label for="email"> Client's email </label>
        <input type="email" name="email" id="email" />
      </div>

      <div class="field col-span-6">
        <label for="street">Street</label>
        <input type="text" name="street" id="street" />
      </div>

      <div class="field col-span-2">
        <label for="city">City</label>
        <input type="text" name="city" id="city" />
      </div>

      <div class="field col-span-2">
        <label for="state">State</label>
        <select name="state" id="state">
          <option />
          {#each states as state}
            <option value={state.value}>{state.name}</option>
          {/each}
        </select>
      </div>

      <div class="field col-span-2">
        <label for="zip">Zip</label>
        <input type="text" name="zip" id="zip" />
      </div>
    </div>
  {/if}

  <!-- due date -->
  <div class="field col-span-2">
    <label for="dueDate">Due Date</label>
    <input type="date" name="dueDate" />
  </div>

  <!-- issue date -->
  <div class="field col-span-2 col-start-5">
    <label for="issueDate">Issue Date</label>
    <input type="date" name="issueDate" />
  </div>

  <!-- subject -->
  <div class="field col-span-6">
    <label for="subject">Subject</label>
    <input type="text" name="subject" />
  </div>

  <!-- line items -->
  <div class="field col-span-6">
    <LineItemRows
      {lineItems}
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
    <textarea name="notes" id="notes" />
  </div>

  <!-- terms -->
  <div class="field col-span-6">
    <label for="terms"
      >Terms <span class="font-normal">(optional, enter your terms and conditions)</span></label
    >
    <textarea name="terms" id="terms" />
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
    <Button label="Cancel" style="secondary" isAnimated={false} onClick={() => {}} />
    <Button label="Save" onClick={() => {}} />
  </div>
</form>
