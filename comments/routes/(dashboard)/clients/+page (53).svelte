<script lang="ts">
  import { onMount } from 'svelte';
  import { loadClients, clients } from '$lib/stores/ClientStore';
  import Button from '$lib/components/Button.svelte';
  import Search from '$lib/components/Search.svelte';
  import ClientRowHeader from './ClientRowHeader.svelte';
  import ClientRow from './ClientRow (56).svelte';
  import BlankState from './BlankState.svelte';

  onMount(() => {
    loadClients();
  });
</script>

<svelte:head>
  <title>Clients | The Dollar Holler</title>
</svelte:head>

<!-- 53.2 Также раскомментируем и исправим эту часть с поиском. -->
<div
  class="md:gap-7-4 mb-7 flex flex-col-reverse items-start justify-between gap-y-6 md:flex-row md:items-center lg:mb-16"
>
  <!-- search field -->
  {#if $clients.length > 0}
    <Search />
  {:else}
    <div />
  {/if}

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

<!-- 53.1 Теперь можно вместо слов "Blank State" вставить наш новый компонент. -->
<!-- clients -->
<div>
  {#if $clients === null}
    Loading...
  {:else if $clients.length <= 0}
    <BlankState />
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
