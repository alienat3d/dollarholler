<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="bg-red-500 p-4">
	{@render children()}
</div>
