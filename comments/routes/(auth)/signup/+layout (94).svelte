<script lang="ts">
  import Unauthenticated from '$lib/components/Unauthenticated.svelte';
  import Snackbar from '$lib/components/Snackbar.svelte';
</script>

<!-- 94.4 Теперь сделаем тоже самое, что и в "src\routes\(dashboard)\+layout.svelte", только оборачивать будем с помощью комп. "Unauthenticated". -->
<!-- Go to [src\routes\settings\+page.svelte] -->
<Unauthenticated>
  <Snackbar />

  <div class="min-h-screen w-full bg-daisyBush bg-center md:bg-auth">
    <div
      class="grid h-screen w-full auto-rows-min grid-cols-12 px-4 md:auto-rows-fr md:gap-5 xl:px-0"
    >
      <div
        class="col-span-12 pt-8 md:col-span-6 md:my-auto lg:col-span-4 lg:col-start-3 xl:col-span-3 xl:col-start-4"
      >
        <img class="mx-auto" src="/images/logo.svg" alt="The Dollar Holler Logo" />
      </div>
      <div class="col-span-12 md:col-span-6 md:my-auto lg:col-span-4 xl:col-span-3">
        <slot><!-- optional fallback --></slot>
      </div>
    </div>
  </div>
</Unauthenticated>
