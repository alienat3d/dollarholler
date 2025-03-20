<script lang="ts">
	export let label: string;
	export let amount: string;
</script>

<div class="bg-circle center float-right flex min-h-[6rem] min-w-[16rem] gap-x-4">
	<div class="font-black">{label}</div>
	<div class="font-mono text-xl font-bold">${amount}</div>
</div>
