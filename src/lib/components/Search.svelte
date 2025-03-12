<script lang="ts">
	import Search from './Icon/Search.svelte';
</script>

<div class="relative flex w-full items-baseline">
	<div class="text-pastel-purple mt-auto mr-2"><Search /></div>
	<input
		class="border-b-pastel-purple font-sans-serif focus:border-b-lavender-indigo text-md w-full border-b-2 border-dashed bg-transparent text-black outline-none focus:border-solid md:w-56 lg:w-72 lg:text-xl"
		type="text"
		name="search"
		placeholder="Search by keyword"
	/>
	<button class="font-sans-serif text-pastel-purple cursor-pointer text-lg font-black lg:text-xl"
		>Search</button
	>
</div>
