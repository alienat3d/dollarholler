<script lang="ts">
	// Мы можем не только указывать тип данных, но и определённые строчки, которые дозволено сюда заносить значением.
	export let label: 'draft' | 'sent' | 'current' | 'late' | 'paid' = 'draft';
</script>

<div
	class="text-md w-20 rounded-full border-1 text-center font-bold capitalize"
	class:inverted={label === 'draft'}
	class:success={label === 'sent' || label === 'current'}
	class:alert={label === 'late'}
	class:archive={label === 'paid'}
>
	{label}
</div>

<style>
	.inverted {
		border-color: var(--color-pastel-purple);
		color: var(--color-pastel-purple);
	}
	.success {
		border-color: var(--color-robin-egg-blue);
		background-color: var(--color-robin-egg-blue);
		color: var(--color-blue-gem);
	}
	.alert {
		border-color: var(--color-scarlet);
		background: var(--color-scarlet);
		color: var(--color-golden-fizz);
	}
	.archive {
		border-color: var(--color-pastel-purple);
		background-color: var(--color-pastel-purple);
		color: var(--color-white);
	}
</style>
