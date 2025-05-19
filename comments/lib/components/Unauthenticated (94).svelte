<!-- Go to [src\routes\(auth)\+layout.svelte] -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import supabase from '$lib/utils/supabase';

  onMount(async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (session) {
      await goto('/invoices');
      return;
    }
  });
</script>

<!-- 94.3 Но, что если, будучи уже залогиненым, пользователь попытается зайти на страницу "/login"? Он всё ещё может это сделать и логичнее было бы в этом случае перенаправлять его на страницу "/invoices". Т.ч. создадим этот, очень похожий на "Authenticated" компонент, но слегка отредактируем его. -->


<slot><!-- optional fallback --></slot>
