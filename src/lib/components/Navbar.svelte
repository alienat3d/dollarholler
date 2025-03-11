<script lang="ts">
	import { page } from '$app/stores';
	import Close from './Icon/Close.svelte';
	import Hamburger from './Icon/Hamburger.svelte';

	// let isNavShowing: boolean;
	// Но т.к. мы хотим, чтобы переменная изначально имела значение false, то вместо указания типа "boolean" мы просто присвоим ей false и TS поймёт, что это булевый тип данных. Также и с другими типами данных вроде number или string.
	let isNavShowing = false;
</script>

<!-- Injects meta-data in head of the document. Also fits for title or other meta-data. -->
<svelte:head>
	{#if isNavShowing}
		<style>
			body {
				overflow: hidden;
			}
		</style>
	{/if}
</svelte:head>

<!-- Mobile Nav Control -->
<button
	class:text-golden-fizz={isNavShowing}
	class="text-daisy-bush fixed top-6 right-6 z-(--navbar-toggle) cursor-pointer transition-colors duration-1200 md:hidden"
	on:click={() => (isNavShowing = !isNavShowing)}
>
	<!-- Альтернативное описание в Svelte: 'isNavShowing ? <Close width={32} height={32} /> : <Hamburger width={32} height={32} />' -->
	{#if isNavShowing}
		<Close width={32} height={32} />
	{:else}
		<Hamburger width={32} height={32} />
	{/if}
</button>

<header
	class="bg-daisy-bush fixed z-(--navbar) h-screen w-full -translate-x-full text-center transition-transform duration-750 md:relative md:col-span-3 md:h-full md:translate-x-0"
	class:translate-x-0={isNavShowing}
>
	<div class="my-10 md:mb-24">
		<a href="/invoices"
			><img class="mx-auto" src="/images/logo.svg" alt="The Dollar Holler logo" /></a
		>
	</div>

	<nav>
		<ul class="list-none text-2xl font-bold">
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
