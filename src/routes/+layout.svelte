<script lang="ts">
	import {onMount} from 'svelte';
	import {invalidate} from '$app/navigation';
	import supabase from '$lib/utils/supabase';
  import '../app.css';

	onMount(() => {
		const {
			data: {subscription},
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth')
		})

		return () => {
			subscription.unsubscribe()
		}
	})
</script>

<slot />
