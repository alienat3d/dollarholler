<script lang="ts">
	import { page } from '$app/stores';
</script>

<header class="bg-daisy-bush col-span-3 text-center">
	<div>
		<a href="/invoices"
			><img class="mx-auto" src="/images/logo.svg" alt="The Dollar Holler logo" /></a
		>
	</div>

	<nav>
		<ul class="mt-23 list-none text-2xl font-bold">
			<li>
				<a class:active={$page.url.pathname === '/invoices'} href="/invoices">Invoices</a>
			</li>
			<li>
				<a class:active={$page.url.pathname === '/clients'} href="/clients">Clients</a>
			</li>
			<li>
				<a href="#">Settings</a>
			</li>
			<li><a href="#">Logout</a></li>
		</ul>
	</nav>
</header>

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
	nav ul li a.active {
		padding-left: 32px;
		padding-right: 32px;
		background:
			url('/images/active-nav--left.svg') left bottom no-repeat,
			url('/images/active-nav--right.svg') right bottom no-repeat;
		color: var(--color-robin-egg-blue);
		transition: padding 0.25s;
	}
	nav ul li a.active:hover {
		padding-left: 36px;
		padding-right: 36px;
	}
</style>
