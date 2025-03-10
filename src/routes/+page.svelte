<script>
	import { formatMe } from '$utils/FormatText';
</script>

<h1 class="font-serif text-3xl font-bold underline">Hello world!</h1>

{formatMe('Al')}

<style lang="postcss">
	@reference "tailwindcss";
	:global(html) {
		background-color: theme(--color-gray-100);
	}
</style>
