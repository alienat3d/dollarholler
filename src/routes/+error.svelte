<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Error | The Dollar Holler</title>
</svelte:head>

<div class="center h-screen w-screen flex-col overflow-x-hidden px-5 text-center text-daisyBush">
  <h1 class="min-h-[250px] min-w-[430px] bg-404 bg-center bg-no-repeat text-[11.25rem] font-black">
    {$page.status}
  </h1>
  <div class="relative -top-12">
    <h2 class="mb-3 text-2xl font-black">Sorry!</h2>
    <p class="text-lg">{$page.error.message}</p>
  </div>
</div>
