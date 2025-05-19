<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import supabase from '$lib/utils/supabase';

  onMount(async () => {
    let { error } = await supabase.auth.signOut();

    if (error) console.error(error.message);

    goto('/login');
  });
</script>
