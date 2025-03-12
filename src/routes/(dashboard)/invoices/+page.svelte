<script lang="ts">
	import { onMount } from 'svelte';
	// importing the store and the function that brings data from the store here
	import { invoices, loadInvoices } from '$lib/stores/InvoiceStore';
	import CircledAmount from '$lib/components/CircledAmount.svelte';
	import Search from '$lib/components/Search.svelte';
	import InvoiceRow from './InvoiceRow.svelte';
	import { sumLineItems } from '$lib/utils/moneyHelpers';

	// Here we should use "$" in front of "invoices", so that Svelte understands it’s not just variable but a store.
	onMount(() => {
		loadInvoices();
		console.log($invoices);
	});
</script>

<svelte:head><title>Invoices | The Dollar Holler</title></svelte:head>

<div
	class="mb-7 flex flex-col-reverse items-start justify-between gap-y-6 md:flex-row md:items-center md:gap-y-4 lg:mb-16"
>
	<Search />

	<!-- new invoice button -->
	<div>
		<button
			class="bg-lavender-indigo font-san-serif shadow-colored hover:shadow-colored-hover text-md relative translate-y-0 cursor-pointer rounded-lg px-5 py-2 font-black whitespace-nowrap text-white transition-all hover:-translate-y-2 lg:px-10 lg:py-3 lg:text-xl"
			>+ Invoice</button
		>
	</div>
</div>

<!-- list of invoices -->
<div>
	<!-- header -->
	<div class="invoice-table table-header text-daisy-bush hidden lg:grid">
		<h3>Status</h3>
		<h3>Due Date</h3>
		<h3>ID</h3>
		<h3>Client</h3>
		<h3 class="text-right">Amount</h3>
		<div></div>
		<div></div>
	</div>

	<!-- Now, as we prepared a component for the invoice rows we can loop over data we get from seed file and insert it in each row. In Svelte we do that with special syntax #each. -->
	<!-- invoices -->
	{#each $invoices as invoice}<InvoiceRow {invoice} />{/each}
</div>

<!-- <CircledAmount amount={sumLineItems($invoices)} /> -->

<style>
	.table-header h3 {
		font-size: 20px;
		font-weight: 900;
		line-height: 1.375;
	}
</style>
