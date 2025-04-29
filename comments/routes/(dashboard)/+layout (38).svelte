<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Snackbar from '$lib/components/Snackbar.svelte';
  // import { snackbar } from '$lib/stores/SnackbarStore';
</script>

<!-- 38.11 Для тестов всплывающего окна комп. Snackbar создадим спец. кнопку, которая будет вызывать его. По клику на кнопку будет вызываться метод хранилища SnackbarStore "send". -->
<!-- Go to [src\lib\components\Snackbar.svelte] -->
<!-- 38.15 Теперь, когда мы убедились, что всё работает как надо, то можно удалить тестовую кнопку, запускавшую сообщения Snackbar. -->
<!-- Go to [src\routes\(dashboard)\invoices\InvoiceForm.svelte] -->
<Snackbar />
<div class="grid min-h-screen grid-cols-12 bg-whisper md:gap-x-16">
  <Navbar />
  <main class="col-span-12 px-4 pt-4 md:col-span-8 md:pt-10">
    <slot><!-- optional fallback --></slot>
    <!-- <button
      on:click={() =>
        snackbar.send({
          message: 'This is a test message',
          type: 'info'
        })}>Trigger Snack</button
    > -->
  </main>
</div>
