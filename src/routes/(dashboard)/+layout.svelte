<script lang="ts">
	let { children } = $props();
</script>

<div class="bg-whisper grid min-h-screen grid-cols-12 gap-x-16.5">
	<header class="bg-daisy-bush col-span-3 text-center">
		<div>
			<a href="/invoices"
				><img class="mx-auto" src="/images/logo.svg" alt="The Dollar Holler logo" /></a
			>
		</div>

		<nav>
			<ul class="list-none text-2xl font-bold">
				<li>
					<a href="/invoices">Invoices</a>
				</li>
				<li>
					<a href="/clients">Clients</a>
				</li>
				<li>
					<a href="#">Settings</a>
				</li>
				<li><a href="#">Logout</a></li>
			</ul>
		</nav>
	</header>

	<main class="col-span-8 pt-10">{@render children()}</main>
</div>

<style>
	nav ul li {
		margin-bottom: 24px;
	}
	nav ul li a {
		font-weight: 700;
		color: var(--color-white);
	}
	nav ul li a:hover {
		color: var(--color-golden-fizz);
	}
</style>
