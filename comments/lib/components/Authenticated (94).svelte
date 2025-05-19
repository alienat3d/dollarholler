<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import supabase from '$lib/utils/supabase';

  // 94.1 На странице доки мы найдём код для этого: (https://supabase.com/docs/reference/javascript/auth-getsession). Итак спец. функция Supabase "getSession" получает id сессии и если она его не получит, значит пользователь незалогинен. Итак, через проверку мы узнаем получил ли "getSession" id сессии и если нет, то перенаправим его на страницу логина.
  // Go to [src\routes\(dashboard)\+layout.svelte]
  onMount(async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
      await goto('/login');
      return;
    }
  });
</script>

<!-- * 94.0 Не лучший способ скрывать страницы для неаутентифицированных пользователей, т.к. на секунду засвечивает страницу, прежде чем сделать редирект, но всё же стоит знать, как сделать подобную защиту с клиентской стороны. Создадим этот компонент, который будет оборачивать весь наш контент, т.е. ему нужен слот. -->
<slot><!-- optional fallback --></slot>
