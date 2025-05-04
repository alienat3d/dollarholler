<script lang="ts">
  import Search from '$lib/components/Icon/Search.svelte';
</script>

<!-- * 62.0 Здесь мы сделаем интересную анимацию для комп. строки поиска. -->

<div class="relative flex w-full items-baseline">
  <div class="mr-2 mt-auto text-pastelPurple"><Search /></div>
  <input
    type="text"
    name="search"
    placeholder="Search by keyword"
    class="search w-full border-b-2 border-dashed border-b-pastelPurple bg-transparent pr-[70px] font-sansSerif text-base text-black outline-none focus:border-solid focus:border-b-lavenderIndigo md:w-[14rem] md:pr-0 lg:w-72 lg:text-xl"
  />
  <!-- 62.1 Добавим стилей: "absolute & left-8". -->
  <!-- 62.3 Чтобы переходы были плавными добавим "transform & transition-transform". -->
  <button
    class="pointer-events-none absolute left-8 transform font-sansSerif text-lg font-black text-pastelPurple transition-transform duration-500 lg:text-xl"
    >Search</button
  >
</div>

<!-- 62.2 Создадим также стили, где при помощи псевдо-селектора пропишем, что нам нужен тег button прямо за строкой ввода, которая в фокусе. И мы поменяем её позиционирование по оси Х на 320px вправо. Но это для крупных экранов, для средних мы сделаем 15.5rem. Однако на более узких экранах становится интереснее. Дело в том, что строка ввода становится 100% и нам нужно вычитать ширину слова "Search" (65px) из 100% с помощью "calc". -->

<!-- 62.4 Чтобы в момент, когда пользователь что-то ввёл в строку поиска, а потом убрал фокус, слово Search не возвращалось и не перекрывало введённый текст, воспользуемся "input:not(:placeholder-shown)". -->
<style lang="postcss">
  input:not(:placeholder-shown) + button,
  input:focus + button {
    @apply pointer-events-auto left-auto right-0 translate-x-[calc(100%-65px)] text-right text-lavenderIndigo md:right-auto md:left-1 md:translate-x-[16rem] lg:translate-x-80;
  }

  input + button:focus,
  input:focus + button:hover {
    @apply text-daisyBush;
  }

  input::placeholder {
    @apply text-transparent;
  }

  input:focus::placeholder {
    @apply text-stone-400;
  }
</style>
