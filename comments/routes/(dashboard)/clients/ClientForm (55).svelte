<script lang="ts">
  import { snackbar } from '$lib/stores/SnackbarStore';
  import { addClient, updateClient } from '$lib/stores/ClientStore';
  import { states } from '$lib/utils/states';
  import Check from '$lib/components/Icon/Check.svelte';
  import Trash from '$lib/components/Icon/Trash.svelte';
  import Button from '$lib/components/Button.svelte';

  export let client: Client = {} as Client;

  // * 55.0 Создадим переменную, которая будет содержать статус формы "create" или "edit".
  export let formState: 'create' | 'edit' = 'create';

  export let closePanel: () => void = () => {};

  // 55.2 Также и в этой функции мы создаём условие, что если статус у формы "create", то мы запусти "addClient", иначе "updateClient". Однако вторую функцию хранилища нам ещё нужно создать.
  // Go to [src\lib\stores\ClientStore.ts]
  const handleSubmit = () => {
    if (formState === 'create') {
      addClient(client);
      snackbar.send({
        message: 'A new client was successfully created.',
        type: 'success'
      });
    } else {
      updateClient(client);
      snackbar.send({
        message: 'The client was successfully updated.',
        type: 'success'
      });
    }
    closePanel();
  };
</script>

<!-- 55.1 Теперь мы в заголовок будет подставляться "Add" либо "Edit", в зависимости от статуса формы. -->
<h2 class="mb-7 font-sansSerif text-3xl font-bold text-daisyBush">
  {#if formState === 'create'}Add{:else}Edit{/if} a Client
</h2>

<form class="grid grid-cols-6 gap-x-5" on:submit|preventDefault={handleSubmit}>
  <!-- client name -->
  <div class="field col-span-6">
    <label for="name">Client Name</label>
    <input class="mt-0.5" type="text" name="name" required bind:value={client.name} />
  </div>

  <!-- email address -->
  <div class="field col-span-6">
    <label for="email">Email Address</label>
    <input class="mt-0.5" type="email" name="email" required bind:value={client.email} />
  </div>

  <!-- address -->
  <div class="field col-span-6">
    <label for="street">Address</label>
    <input class="mt-0.5" type="text" name="street" required bind:value={client.street} />
  </div>

  <!-- city -->
  <div class="field col-span-2">
    <label for="city">City</label>
    <input type="text" name="city" bind:value={client.city} />
  </div>

  <!-- state -->
  <div class="field col-span-2">
    <label for="state">State</label>
    <select name="state" bind:value={client.state}>
      <option />
      {#each states as state}
        <option value={state.value}>{state.name}</option>
      {/each}
    </select>
  </div>

  <!-- zip -->
  <div class="field col-span-2 mb-20">
    <label for="zip">Zip</label>
    <input type="text" name="zip" minlength="5" bind:value={client.zip} />
  </div>

  <!-- buttons -->
  <div class="field col-span-3">
    {#if formState === 'edit'}
      <Button
        label="Delete"
        onClick={() => {}}
        isAnimated={false}
        style="textOnlyDestructive"
        iconLeft={Trash}
      />
    {/if}
  </div>
  <div class="field col-span-3 flex justify-end gap-x-5">
    <Button label="Cancel" style="secondary" isAnimated={false} onClick={closePanel} />
    <button
      class="button translate-y-0 bg-lavenderIndigo text-white shadow-colored transition-all hover:-translate-y-2 hover:shadow-coloredHover"
      type="submit"
    >
      <span class="mr-1"><Check /></span>Save
    </button>
  </div>
</form>
