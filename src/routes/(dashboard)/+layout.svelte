<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<div class="bg-whisper grid min-h-screen grid-cols-12 gap-x-16.5">
	<Navbar />
	<main class="col-span-8 pt-10">{@render children()}</main>
</div>
