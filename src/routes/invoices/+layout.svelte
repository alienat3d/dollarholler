<script lang="ts">
	import Dashboard from '$lib/layouts/Dashboard.svelte';

	let { children } = $props();
</script>

<div class="bg-yellow-400 p-4">
	<Dashboard>{@render children()}</Dashboard>
</div>
