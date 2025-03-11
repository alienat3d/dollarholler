<script lang="ts">
	import CircledAmount from '$lib/components/CircledAmount.svelte';
	import ThreeDots from '$lib/components/Icon/ThreeDots.svelte';
	import View from '$lib/components/Icon/View.svelte';
	import Search from '$lib/components/Search.svelte';
	import Tag from '$lib/components/Tag.svelte';
</script>

<svelte:head><title>Invoices | The Dollar Holler</title></svelte:head>

<div class="mb-16 flex items-center justify-between">
	<Search />

	<!-- new invoice button -->
	<div>
		<button
			class="bg-lavender-indigo font-san-serif shadow-colored hover:shadow-colored-hover relative translate-y-0 cursor-pointer rounded-lg px-10 py-3 text-xl font-black whitespace-nowrap text-white transition-all hover:-translate-y-2"
			>+ Invoice</button
		>
	</div>
</div>

<!-- list of invoices -->
<div>
	<!-- header -->
	<div class="invoice-table table-header text-daisy-bush">
		<h3>Status</h3>
		<h3>Due Date</h3>
		<h3>ID</h3>
		<h3>Client</h3>
		<h3>Amount</h3>
		<div></div>
		<div></div>
	</div>

	<!-- invoices -->
	<div class="invoice-table table-header shadow-table-row items-center rounded-lg bg-white py-6">
		<div><Tag label="late" /></div>
		<div class="text-lg">11/3/2025</div>
		<div class="text-lg">12345</div>
		<div class="text-xl font-bold">John Doe</div>
		<div class="font-mono text-lg font-bold">$999.99</div>
		<a class="text-pastel-purple hover:text-daisy-bush transition-colors" href="#"><View /></a>
		<button class="center text-pastel-purple hover:text-daisy-bush cursor-pointer transition-colors"
			><ThreeDots /></button
		>
	</div>
</div>

<CircledAmount amount={2255.95} />

<style>
	.table-header h3 {
		font-size: 20px;
		font-weight: 900;
		line-height: 1.375;
	}
</style>
