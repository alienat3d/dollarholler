<script lang="ts">
	import BlankRow from '$lib/components/BlankRow.svelte';
	import InvoiceRowHeader from './InvoiceRowHeader.svelte';
</script>

<div class="-mt-8 md:max-lg:mt-0">
	<h2
		class="arrow-pointer font-handwriting text-caribbean-green mb-10 pt-26 text-4xl font-bold sm:pt-16 sm:pl-36 md:pr-28 md:pl-0 md:text-right"
	>
		Add your first invoice
	</h2>
	<!-- invoice header -->
	<InvoiceRowHeader className="text-fog" />

	<!-- blank rows -->
	<BlankRow />
	<BlankRow />
	<BlankRow />
	<BlankRow />
</div>

<style>
	.arrow-pointer {
		background: url('/images/arrow-pointer-left.svg') no-repeat 5% 0;
	}
	@media (min-width: 640px) {
		.arrow-pointer {
			background: url('/images/arrow-pointer-left.svg') no-repeat 5% bottom;
		}
	}
	@media (min-width: 768px) {
		.arrow-pointer {
			background: url('/images/arrow-pointer-right.svg') no-repeat right top;
		}
	}
</style>
