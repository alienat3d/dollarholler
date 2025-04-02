<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ArrowLeft from './Icon/ArrowLeft.svelte';
	import Overlay from './Overlay.svelte';
	import Portal from './Portal.svelte';

	// We have to make sure that the parent component of this one know about we clicked the "Close"-button in order to remove it, so we’ll use dispatch again here.
	const dispatch = createEventDispatcher();
</script>

<!-- Also setup a functionality for closing via "Escape" key on keyboard. -->
<svelte:window
	on:keydown={(evt) => {
		if (evt.key === 'Escape') dispatch('close');
	}}
/>

<Portal>
	<Overlay />
	<div
		class="fixed top-0 right-0 z-[--slide-panel] h-screen w-3/4 overflow-y-scroll bg-white px-32 py-20 shadow-[--shadow-slide-panel]"
	>
		<button
			on:click={() => dispatch('closePanel')}
			class="text-pastel-purple hover:text-daisy-bush absolute top-5 left-7 cursor-pointer transition-colors"
		>
			<ArrowLeft />
		</button>
		<slot></slot>
	</div>
</Portal>
