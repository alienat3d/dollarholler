<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Search from '$lib/components/Icon/Search.svelte';

  let searchTerms: string = '';

  const dispatch = createEventDispatcher();

  const handleSubmit = () => dispatch('search', { searchTerms });
</script>

<form on:submit|preventDefault={handleSubmit} class="relative flex w-full items-baseline">
  <div class="mr-2 mt-auto text-pastelPurple"><Search /></div>
  <input
    bind:value={searchTerms}
    on:search={() => dispatch('clear', { searchTerms })}
    type="search"
    name="search"
    placeholder="Search by keyword"
    class="search w-full border-b-2 border-dashed border-b-pastelPurple bg-transparent pr-[70px] font-sansSerif text-base text-black outline-none focus:border-solid focus:border-b-lavenderIndigo md:w-[14rem] md:pr-0 lg:w-72 lg:text-xl"
  />
  <button
    class="pointer-events-none absolute left-8 transform font-sansSerif text-lg font-black text-pastelPurple transition-transform duration-500 lg:text-xl"
    >Search</button
  >
</form>

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
