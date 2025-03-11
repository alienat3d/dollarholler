<script lang="ts">
	import CircledAmount from '$lib/components/CircledAmount.svelte';
	import ThreeDots from '$lib/components/Icon/ThreeDots.svelte';
	import View from '$lib/components/Icon/View.svelte';
	import Search from '$lib/components/Search.svelte';
	import Tag from '$lib/components/Tag.svelte';
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
		<h3>Amount</h3>
		<div></div>
		<div></div>
	</div>

	<!-- invoices -->
	<div
		class="invoice-table table-header invoice-row shadow-table-row items-center rounded-lg bg-white py-3 lg:py-6"
	>
		<div class="status"><Tag className="ml-auto lg:ml-0" label="late" /></div>
		<div class="due-date text-md lg:text-lg">11/3/2025</div>
		<div class="invoice-number text-md lg:text-lg">12345</div>
		<div class="client-name text-lg font-bold lg:text-xl">John Doe</div>
		<div class="amount text-md text-right font-mono font-bold lg:text-left lg:text-lg">
			$9999.99
		</div>
		<a
			class="view-button text-pastel-purple hover:text-daisy-bush hidden transition-colors lg:block"
			href="#"
		>
			<View />
		</a>
		<button
			class="more-button center text-pastel-purple hover:text-daisy-bush cursor-pointer transition-colors"
		>
			<ThreeDots />
		</button>
	</div>
</div>

<CircledAmount amount={2255.95} />

<style>
	.table-header h3 {
		font-size: 20px;
		font-weight: 900;
		line-height: 1.375;
	}

	/* Naming columns in the rows */
	.invoice-row {
		grid-template-areas: 'invoice-number invoice-number' 'client-name amount' 'due-date status';
	}
	@media (min-width: 1024px) {
		.invoice-row {
			grid-template-areas: 'status due-date invoice-number client-name amount view-button more-button';
		}
	}
	.invoice-row .status {
		grid-area: status;
	}
	.invoice-row .due-date {
		grid-area: due-date;
	}
	.invoice-row .invoice-number {
		grid-area: invoice-number;
	}
	.invoice-row .client-name {
		grid-area: client-name;
	}
	.invoice-row .amount {
		grid-area: amount;
	}
	.invoice-row .view-button {
		grid-area: view-button;
	}
	.invoice-row .more-button {
		grid-area: more-button;
	}

	.more-button {
		display: none;
	}
	@media (min-width: 1024px) {
		.more-button {
			display: block;
		}
	}
</style>
