<script lang="ts">
	import Search from './Icon/Search.svelte';
</script>

<div class="relative flex w-full items-baseline">
	<div class="text-pastel-purple mt-auto mr-2"><Search /></div>
	<input
		class="border-b-pastel-purple font-san-serif focus:border-b-lavender-indigo w-72 border-b-2 border-dashed bg-transparent text-xl text-black outline-none focus:border-solid"
		type="text"
		name="search"
		placeholder="Search by keyword"
	/>
	<button class="font-san-serif text-pastel-purple cursor-pointer text-xl font-black">Search</button
	>
</div>
