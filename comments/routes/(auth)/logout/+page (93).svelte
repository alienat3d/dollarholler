<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import supabase from '$lib/utils/supabase';

  // * 93.0 Для функции логаута создадим новую папку "logout" и этот файл, где в жиз. цикле "onMount" будет запускаться функция "signOut".
  // 93.1 А также проверим на наличие ошибки и после проверки, если их нет, то перенаправим пользователя на страницу логина.
  onMount(async () => {
    let { error } = await supabase.auth.signOut();

    if (error) console.error(error.message);

    goto('/login');
  });
</script>
