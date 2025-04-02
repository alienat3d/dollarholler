<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let label: string;
	export let onClick: () => void;

	export let style:
		| 'primary'
		| 'secondary'
		| 'destructive'
		| 'outline'
		| 'textOnly'
		| 'textOnlyDestructive' = 'primary';
	export let isAnimated = true;

	// Adding an ability to add icons on the left or on the right side of the button.
	export let iconLeft: (new (...args: any[]) => SvelteComponent) | null = null;
	export let iconRight: (new (...args: any[]) => SvelteComponent) | null = null;
</script>

<button
	on:click|preventDefault={onClick}
	class:isAnimated
	class:primary={style === 'primary'}
	class:secondary={style === 'secondary'}
	class:destructive={style === 'destructive'}
	class:outline={style === 'outline'}
	class:textOnly={style === 'textOnly'}
	class:textOnlyDestructive={style === 'textOnlyDestructive'}
	class="font-sans-serif text-md relative flex cursor-pointer items-center rounded-lg px-5 py-2 font-black whitespace-nowrap lg:px-10 lg:py-3 lg:text-xl"
>
	{#if iconLeft}<svelte:component this={iconLeft} className="mr-2" />{/if}
	{label}
	{#if iconRight}<svelte:component this={iconRight} className="ml-2" />{/if}
</button>

<style>
	/* Same as: "translate-y-0 shadow-colored transition-all" */
	.isAnimated {
		--tw-translate-y: calc(var(--spacing) * 0);
		translate: var(--tw-translate-x) var(--tw-translate-y);
		--tw-shadow: 0 7px 16px var(--tw-shadow-color, rgba(127, 91, 220, 0.002));
		box-shadow:
			var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow),
			var(--tw-ring-shadow), var(--tw-shadow);
		transition-property: all;
		transition-timing-function: var(
			--tw-ease,
			var(--default-transition-timing-function) /* cubic-bezier(0.4, 0, 0.2, 1) */
		);
		transition-duration: var(--tw-duration, var(--default-transition-duration) /* 150ms */);
	}
	/* Same as: "hover:-translate-y-2 hover:shadow-colored-hover" */
	.isAnimated:hover {
		--tw-shadow: 0 16px 25px var(--tw-shadow-color, rgba(127, 91, 220, 0.3));
		box-shadow:
			var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow),
			var(--tw-ring-shadow), var(--tw-shadow);
		--tw-translate-y: calc(var(--spacing) * -2) /* -0.5rem = -8px */;
		translate: var(--tw-translate-x) var(--tw-translate-y);
	}
	/* Same as: "bg-lavender-indigo text-white" */
	.primary {
		background-color: var(--color-lavender-indigo) /* #8657e1 */;
		color: var(--color-white) /* #fff = #ffffff */;
	}
	/* Same as: "bg-gallery text-daisy-bush" */
	.secondary {
		background-color: var(--color-gallery) /* #efeaf2 */;
		color: var(--color-daisy-bush) /* #4714a5 */;
	}
	/* Same as: "bg-scarlet text-golden-fizz" */
	.destructive {
		background-color: var(--color-scarlet) /* #f72f45 */;
		color: var(--color-golden-fizz) /* #feff40 */;
	}
	/* Same as: "border-daisy-bush text-daisy-bush" */
	.outline {
		border: 1px solid var(--color-daisy-bush) /* #4714a5 */;
		color: var(--color-daisy-bush) /* #4714a5 */;
		transition: all 0.25s ease;
	}
	/* Same as: hover:bg-daisy-bush hover:text-white */
	.outline:hover {
		background-color: var(--color-daisy-bush) /* #4714a5 */;
		color: var(--color-white) /* #fff */;
	}
	/* Same as: "bg-transparent px-0 text-lavender-indigo no-underline" */
	.textOnly {
		padding-left: 0;
		padding-right: 0;
		background-color: transparent;
		color: var(--color-lavender-indigo) /* #f72f45 */;
		text-decoration-line: none;
	}
	/* Same as: "hover:underline" */
	.textOnly:hover {
		text-decoration-line: underline;
	}
	/* Same as: "bg-transparent px-0 text-scarlet underline" */
	.textOnlyDestructive {
		padding-left: 0;
		padding-right: 0;
		background-color: transparent;
		color: var(--color-scarlet) /* #f72f45 */;
		text-decoration-line: underline;
	}
	/* Same as: "hover:no-underline" */
	.textOnlyDestructive:hover {
		text-decoration-line: none;
	}
</style>
