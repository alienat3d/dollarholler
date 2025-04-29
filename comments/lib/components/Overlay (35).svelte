<!-- 35.15.0 Добавим блок script, чтобы добавить комп. проп "className" и по умолчанию он будет пустым. -->
<script lang="ts">
  export let className: string = '';
</script>

<svelte:head>
  <style lang="postcss">
    body {
      @apply overflow-hidden;
    }
  </style>
</svelte:head>

<!-- 35.15.1 Обернём классы в {``} и тогда можно будет добавить наш новый динамический класс. -->
<!-- Go to {src\lib\components\Modal.svelte} -->
<div class={`fixed inset-0 z-overlay bg-blueGem opacity-60 ${className}`} />
