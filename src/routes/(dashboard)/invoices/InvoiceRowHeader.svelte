<script lang="ts">
	export let className = '';
</script>

<!-- Since in the empty state we have header titles in lighter purple colors compared to the filled state, we need to add a dynamic style for them. -->
<div class={`invoice-table table-header hidden lg:grid ${className}`}>
	<h3>Status</h3>
	<h3>Due Date</h3>
	<h3>ID</h3>
	<h3>Client</h3>
	<h3 class="text-right">Amount</h3>
	<div></div>
	<div></div>
</div>

<style>
	.table-header h3 {
		font-size: 20px;
		font-weight: 900;
		line-height: 1.375;
	}
</style>
