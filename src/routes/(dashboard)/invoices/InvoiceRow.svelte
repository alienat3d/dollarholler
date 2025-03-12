<script lang="ts">
	import Tag from '$lib/components/Tag.svelte';
	import View from '$lib/components/Icon/View.svelte';
	import ThreeDots from '$lib/components/Icon/ThreeDots.svelte';
	import { centsToDollars, sumLineItems } from '$lib/utils/moneyHelpers';
	import { convertDate, isLate } from '$lib/utils/dateHelpers';

	// We also should explicitly tell TypeScript the type of "invoice"
	export let invoice: Invoice;

	const getInvoiceLabel = () => {
		if (invoice.invoiceStatus === 'draft') {
			return 'draft';
		} else if (invoice.invoiceStatus === 'sent' && !isLate(invoice.dueDate)) {
			return 'sent';
		} else if (invoice.invoiceStatus === 'sent' && isLate(invoice.dueDate)) {
			return 'late';
		} else if (invoice.invoiceStatus === 'paid') {
			return 'paid';
		}
	};
</script>

<!-- So now we can fill in all the data in our template by names of keys from the data object we receive. -->
<div
	class="invoice-table table-header invoice-row shadow-table-row items-center rounded-lg bg-white py-3 lg:py-6"
>
	<div class="status"><Tag className="ml-auto lg:ml-0" label={getInvoiceLabel()} /></div>
	<div class="due-date text-md lg:text-lg">{convertDate(invoice.dueDate)}</div>
	<div class="invoice-number text-md lg:text-lg">{invoice.invoiceNumber}</div>
	<div class="client-name truncate text-lg font-bold whitespace-nowrap lg:text-xl">
		{invoice.client.name}
	</div>
	<div class="amount text-md text-right font-mono font-bold lg:text-lg">
		${centsToDollars(sumLineItems(invoice.lineItems))}
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

<style>
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
