<!-- * 54.0 По образу и подобию формы для инвойсов создадим форму для добавления новых клиентов. -->
<script lang="ts">
  import { addClient } from '$lib/stores/ClientStore';
  import { states } from '$lib/utils/states';
  import Button from '$lib/components/Button.svelte';
  // import Trash from '$lib/components/Icon/Trash.svelte';
  import Check from '$lib/components/Icon/Check.svelte';

  // 54.1.0 Добавим client и присвоим ему тип объекта Client.
  export let client: Client = {} as Client;

  export let closePanel: () => void = () => {};

  const handleSubmit = () => {
    // 54.2.1 Далее мы сперва проверим с помощью console.log попадают ли вообще данные в объект "client".
    // console.log({ client });

    // 54.2.2 Затем нам надо отправлять их в хранилище клиентов и у нас уже есть там метод добавления нового клиента в хранилище "addClient", т.ч. нам нужно просто добавить его сюда.
    addClient(client);

    // 54.2.3 И после этого будем скрывать панель формы.
    closePanel();
  };
</script>

<h2 class="mb-7 font-sansSerif text-3xl font-bold text-daisyBush">Add a Client</h2>

<!-- 54.2.0 Далее нам нужно отправлять все эти данные в БД, для этого на событие "submit" повесим спец. функцию "handleSubmit" с мод. preventDefault, чтобы страница не обновлялась. -->
<form class="grid grid-cols-6 gap-x-5" on:submit|preventDefault={handleSubmit}>
  <!-- 54.1.1 А дальше мы можем при помощи "bind" привязывать каждый инпут формы к объекту client, чтобы в итоге добавлять данные в объект. -->
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
  <div class="field col-span-6 flex justify-end gap-x-5">
    <Button label="Cancel" style="secondary" isAnimated={false} onClick={() => closePanel()} />
    <button
      class="button translate-y-0 bg-lavenderIndigo text-white shadow-colored transition-all hover:-translate-y-2 hover:shadow-coloredHover"
      type="submit"
    >
      <span class="mr-1"><Check /></span>Save
    </button>
  </div>
</form>
