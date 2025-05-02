<!-- Go to [src\routes\(dashboard)\clients\+page.svelte] -->
<script lang="ts">
  import BlankRow from '$lib/components/BlankRow.svelte';
  import ClientRowHeader from './ClientRowHeader.svelte';
</script>

<!-- * 53.0 Создаём комп. заглушку, пока загружаются данные клиентов. Она будет очень похожа на ту, что мы уже сделали для списка инвойсов, поэтому просто скопируем оттуда и отредактируем. -->


<div>
  <div class="-mt-8 md:-mt-6 lg:-mt-14">
    <h2
      class="mb-10 bg-arrowLeftUp bg-left bg-no-repeat pt-14 pl-24 text-left font-handwriting text-2xl font-bold text-caribbeanGreen md:bg-arrowRightUp md:bg-right md:pl-0 md:pr-28 md:text-right md:text-4xl"
    >
      Add Your First Client
    </h2>
  </div>
  <!-- client header -->
  <ClientRowHeader className="text-fog" />

  <!-- blank rows -->
  <BlankRow />
  <BlankRow />
  <BlankRow />
</div>
