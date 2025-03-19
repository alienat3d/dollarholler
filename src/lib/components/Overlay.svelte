<script lang="ts">
	let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

	const hasYScroll = () => {
		if (scrollbarWidth > 0) return true;
	};
</script>

<!-- When we write so it will apply but everywhere and in any time. So we have to make it differently and put it inside "svelte:head" tag, so it applies only when Overlay is active on the page. -->
<svelte:head>
	{#if hasYScroll()}
		<style>
			/* :global(:root) {
					--scrollbarWidth: {scrollbarWidth}px;
				} */
			body {
				overflow: hidden;
				padding-right: 17px;
				background-color: var(--color-whisper);
			}
		</style>
	{/if}
</svelte:head>

<!-- Actually it’s better to abstract this and make an extra component Overlay, that will wraps modal window. -->
<div class="bg-blue-gem fixed inset-0 z-[--modal-overlay] opacity-60"></div>
