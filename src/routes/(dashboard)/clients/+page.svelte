<script lang="ts">
  import { onMount } from 'svelte';
  import { loadClients, clients } from '$lib/stores/ClientStore';
  import Button from '$lib/components/Button.svelte';
  import Search from '$lib/components/Search.svelte';
  import ClientRowHeader from './ClientRowHeader.svelte';
  import ClientRow from './ClientRow.svelte';

  onMount(() => {
    loadClients();
  });
</script>

<svelte:head>
  <title>Clients | The Dollar Holler</title>
</svelte:head>

<div
  class="md:gap-7-4 mb-7 flex flex-col-reverse items-start justify-between gap-y-6 md:flex-row md:items-center lg:mb-16"
>
  <!-- search field -->
  <!-- {#if $clients === null} -->
  <Search />
  <!-- {:else}
    <div />
  {/if} -->

  <!-- new invoice button -->
  <div>
    <Button
      label="+ Client"
      onClick={() => {
        // isInvoiceFormShowing = true;
      }}
    />
  </div>
</div>

<!-- clients -->
<div>
  {#if $clients === null}
    Loading...
  {:else if $clients.length <= 0}
    Blank State
  {:else}
    <!-- client header row -->
    <ClientRowHeader />

    <div class="flex flex-col-reverse">
      {#each $clients as client}
        <ClientRow {client} />
      {/each}
    </div>
  {/if}
</div>
