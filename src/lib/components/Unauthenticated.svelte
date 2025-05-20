<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import supabase from '$lib/utils/supabase';

  onMount(async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (session && $page.url.pathname !== '/reset-password') {
      await goto('/invoices');
      return;
    }
  });
</script>

<slot><!-- optional fallback --></slot>
