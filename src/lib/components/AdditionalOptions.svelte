<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let options: {
		label: string;
		icon?: new (...args: any[]) => SvelteComponent;
		disabled: boolean;
		onClick: () => void;
	}[];
</script>

<ul class="absolute top-4 left-0 rounded-lg bg-white shadow-lg">
	{#each options as option}
		{#if !option.disabled}
			<li class="border-whisper border-b-2">
				<button
					class="font-sans-serif text-pastel-purple hover:text-daisy-bush flex w-full cursor-pointer gap-x-2 p-4 font-bold transition-colors"
					on:click={option.onClick}
				>
					{#if option.icon}
						<svelte:component this={option.icon} />
					{/if}
					{option.label}
				</button>
			</li>
		{/if}
	{/each}
</ul>

<style>
	li:last-child {
		border-bottom: 0;
	}
</style>
