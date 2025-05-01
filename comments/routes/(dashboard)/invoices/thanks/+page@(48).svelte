<!-- * 48.0 Итак мы создаём здесь страницу благодарности за успешно выполненный платёж. "@"на конце в названии этого файла означает, что он не унаследует что либо из [src\routes\(dashboard)\+layout.svelte], но он перейдёт и унаследует у следующего по иерархии [src\routes\+layout.svelte] в корневой директории. -->
<!-- 48.1 Мы используем "svelte:head", чтобы вставлять мета-данные. -->
<svelte:head>
  <title>Thank You | The Dollar Holler</title>
</svelte:head>

<div class="center h-screen w-screen bg-thankYou bg-center bg-no-repeat">
  <div class="text-daisyBush">
    <h1 class="text-[3.5rem] font-black leading-none">Thank You!</h1>
    <p class="text-lg">Your payment has been received.</p>
  </div>
</div>
