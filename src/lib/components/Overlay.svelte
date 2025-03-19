<!-- <script lang="ts">
	const getScrollbarWidth = () =>
		console.log(window.innerWidth - document.documentElement.clientWidth);

	getScrollbarWidth();
</script> -->

<!-- When we write so it will apply but everywhere and in any time. So we have to make it differently and put it inside "svelte:head" tag, so it applies only when Overlay is active on the page. -->
<svelte:head>
	<style>
		body {
			overflow: hidden;
			padding-right: 17px;
			background-color: var(--color-whisper);
		}
	</style>
</svelte:head>

<!-- Actually it’s better to abstract this and make an extra component Overlay, that will wraps modal window. -->
<div class="bg-blue-gem fixed inset-0 z-[--modal-overlay] opacity-60"></div>
