<script lang="ts">
	import { onMount } from 'svelte';
	// importing the store and the function that brings data from the store here
	import { invoices, loadInvoices } from '$lib/stores/InvoiceStore';
	import { centsToDollars, sumInvoices } from '$lib/utils/moneyHelpers';
	import CircledAmount from '$lib/components/CircledAmount.svelte';
	import Search from '$lib/components/Search.svelte';
	import InvoiceRow from './InvoiceRow.svelte';
	import BlankState from './BlankState.svelte';
	import InvoiceRowHeader from './InvoiceRowHeader.svelte';
	import Button from '$lib/components/Button.svelte';
	import SlidePanel from '$lib/components/SlidePanel.svelte';
	import InvoiceForm from './InvoiceForm.svelte';

	let isInvoiceFormShowing: boolean = false;

	// Here we should use "$" in front of "invoices", so that Svelte understands it’s not just variable but a store.
	onMount(() => {
		loadInvoices();
	});
</script>

<svelte:head><title>Invoices | The Dollar Holler</title></svelte:head>

<div
	class="mb-7 flex flex-col-reverse items-start justify-between gap-y-6 md:flex-row md:items-center md:gap-y-4 lg:mb-16"
>
	{#if $invoices.length > 0}
		<Search />
	{:else}
		<div></div>
	{/if}
	<!-- new invoice button -->
	<div>
		<Button
			label="+ Invoice"
			onClick={() => {
				isInvoiceFormShowing = true;
			}}
		/>
	</div>
</div>

<!-- list of invoices -->
<div>
	<!-- Now, as we prepared a component for the invoice rows we can loop over data we get from seed file and insert it in each row. In Svelte we do that with special syntax #each. -->
	<!-- We’ll be showing a special component for the case there are no any invoices created yet to give to the use an idea what do to with the UI. -->
	{#if $invoices === null}
		Loading...
	{:else if $invoices.length <= 0}
		<BlankState />
	{:else}
		<InvoiceRowHeader className="text-daisy-bush" />
		<!-- To fix a z-index issue of the popping up 'more button menu' we made a flex-wrapper and set it to column-reverse. -->
		<div class="flex flex-col-reverse transition-colors">
			{#each $invoices as invoice (invoice.id)}
				<InvoiceRow {invoice} />
			{/each}
		</div>
		<CircledAmount label="Total:" amount={centsToDollars(sumInvoices($invoices))} />
	{/if}
</div>

<!-- Slide Panel (for + Invoice button) -->
{#if isInvoiceFormShowing}
	<SlidePanel
		on:closePanel={() => {
			isInvoiceFormShowing = false;
		}}
	>
		<InvoiceForm></InvoiceForm>
	</SlidePanel>
{/if}
