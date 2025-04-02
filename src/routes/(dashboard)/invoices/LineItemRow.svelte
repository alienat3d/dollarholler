<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Trash from '$lib/components/Icon/Trash.svelte';

	export let lineItem: LineItem;

	let dispatch = createEventDispatcher();
</script>

<div class="invoice-line-item border-fog border-b-2 py-2">
	<div>
		<input class="line-item" type="text" name="description" />
	</div>

	<div>
		<input class="line-item text-right" type="number" name="unitPrice" step="0.01" min="0" />
	</div>

	<div>
		<input class="line-item text-center" type="number" name="quantity" min="0" value="1" />
	</div>

	<div>
		<input class="line-item text-right" type="number" name="amount" step="0.01" min="0" />
	</div>

	<div>
		<button
			on:click|preventDefault={() => {
				dispatch('removeLineItem', lineItem.id);
			}}
			class="center text-pastel-purple hover:text-lavender-indigo h-10 w-10 cursor-pointer transition-colors"
			><Trash /></button
		>
	</div>
</div>

<style>
	/* Same as: h-10 w-full border-b-2 border-dashed border-stone-300 */
	input[type='text'],
	input[type='number'] {
		border-radius: 0;
		border: none;
		border-bottom: 2px dashed #d6d3d1;
		height: 40px;
		width: 100%;
		transition: border 0.15s ease;
	}

	input[type='text'] {
		font-family: var(--font-sans-serif);
		font-weight: 700;
		font-size: 20px;
	}

	input[type='number'] {
		font-family: var(--font-mono);
		font-size: 16px;
	}

	input[type='text']:hover,
	input[type='number']:hover {
		border-bottom: 2px solid var(--color-pastel-purple);
	}

	input[type='text']:focus,
	input[type='number']:focus {
		border-bottom: 2px solid var(--color-lavender-indigo);
		outline: none;
	}
</style>
