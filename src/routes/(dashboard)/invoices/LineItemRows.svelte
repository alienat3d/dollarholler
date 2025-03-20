<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import CircledAmount from '$lib/components/CircledAmount.svelte';
	import LineItemRow from './LineItemRow.svelte';

	export let lineItems: LineItem[] | undefined = undefined;
</script>

<div class="invoice-line-item border-daisy-bush border-b-2 pb-2">
	<div class="table-header">Description</div>
	<div class="table-header text-right">Unit Price</div>
	<div class="table-header text-center">Qty.</div>
	<div class="table-header text-right">Amount</div>
</div>

{#if lineItems}
	{#each lineItems as lineItem}
		<LineItemRow {lineItem} />
	{/each}
{/if}

<div class="invoice-line-item">
	<div class="col-span-2">
		<Button onClick={() => {}} isAnimated={false} style="textOnly" label="+ Line Item" />
	</div>
	<div class="text-monsoon py-5 text-right font-bold">Subtotal</div>
	<div class="py-5 text-right font-mono">$250.00</div>
</div>

<div class="invoice-line-item">
	<div class="text-monsoon col-span-2 py-5 text-right font-bold">Discount</div>
	<div class="relative">
		<input
			class="line-item focus:border-lavender-indigo hover:border-pastel-purple h-10 w-full border-b-2 border-dashed border-stone-300 pr-4 text-right text-lg transition-colors hover:border-solid focus:border-solid focus:outline-none"
			type="number"
			name="discount"
			min="0"
			max="100"
		/>
		<span class="absolute top-2 right-3.5 font-sans">%</span>
	</div>
	<div class="py-5 text-right font-mono">$10.00</div>
</div>

<div class="invoice-line-item">
	<div class="col-span-6">
		<CircledAmount label="Total:" amount="1,234.50" />
	</div>
</div>

<style>
	.table-header {
		font-weight: 700;
		font-size: 16px;
		line-height: 1.4;
		color: var(--color-daisy-bush);
	}
</style>
