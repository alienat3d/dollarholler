<script>
  import BlankRow from '$lib/components/BlankRow.svelte';
  import ClientRowHeader from '../clients/ClientRowHeader.svelte';
</script>

<div class="mt-20 lg:-mt-14">
  <div class="ml-2 mb-10 bg-arrowLeftUp bg-no-repeat pl-28 pt-14">
    <h2 class="font-handwriting text-4xl font-bold text-caribbeanGreen">Bummer!</h2>
    <p class="text-xl font-bold text-caribbeanGreen">
      We didn't find anything that matched what you were looking for.
    </p>
  </div>

  <!-- 90.5 Скопируем этот комп. из списка инвойсов и отредактируем его немного, а точнее заменим комп. InvoiceRowHeader на ClientRowHeader -->
  <ClientRowHeader className="text-fog" />
  <BlankRow />
  <BlankRow />
  <BlankRow />
</div>
