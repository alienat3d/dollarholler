<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { deleteClient } from '$lib/stores/ClientStore';
  import { centsToDollars, sumLineItems } from '$lib/utils/moneyHelpers';
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';

  export let client: Client;
  export let isModalShowing: boolean = false;

  // 88.5 Теперь займёмся созданием такого же комп., как и [src\routes\(dashboard)\invoices\ConfirmDelete.svelte], но для клиентов. Поэтому, просто скопируем его содержимое сюда и будем делать правки. Здесь, в функции удаления нам нужно вместо инвойса указать клиента.
  const handleDelete = async () => {
    await deleteClient(client);
    dispatch('close');
  };

  const dispatch = createEventDispatcher();
</script>

<!-- 88.6 Также нужно заменить текст самой модалки. -->
<!-- Go to [src\routes\(dashboard)\clients\ClientRow.svelte] -->
<Modal isVisible={isModalShowing} on:close>
  <div class="flex h-full min-h-[175px] flex-col items-center justify-between gap-6">
    <div class="text-center text-xl font-bold text-daisyBush">
      Are you sure you want to delete this client: <span class="text-scarlet">{client.name}</span> and
      all their invoices?
    </div>
    <div class="flex gap-4">
      <Button
        isAnimated={false}
        label="Cancel"
        onClick={() => dispatch('close')}
        style="secondary"
      />
      <Button
        isAnimated={false}
        label="Yes, Delete It"
        onClick={handleDelete}
        style="destructive"
      />
    </div>
  </div>
</Modal>
