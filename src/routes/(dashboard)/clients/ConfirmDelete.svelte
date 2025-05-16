<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { deleteClient } from '$lib/stores/ClientStore';
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';

  export let client: Client;
  export let isModalShowing: boolean = false;

  const handleDelete = async () => {
    await deleteClient(client);
    dispatch('close');
  };

  const dispatch = createEventDispatcher();
</script>

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
