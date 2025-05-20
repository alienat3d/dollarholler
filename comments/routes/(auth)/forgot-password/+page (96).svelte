<script lang="ts">
  import { env } from '$env/dynamic/public';
  import supabase from '$lib/utils/supabase';
  import Alert from '$lib/components/Alert.svelte';
  import Loader from '$lib/components/Loader.svelte';

  // * 96.0 Займёмся функционалом восстановления забытого пароля. И для начала нам нужно помещать введённые в инпут данные об адресе эл. почты.
  let email: string = '';

  // 96.3.0 ↓ Нам также нужно уведомить пользователя с помощью комп. Alert и для него создадим переменную "message".
  let message: string = '';

  // 96.4.0 Осталось ещё здесь создать переменную, хранящую состояние загрузки, чтобы блокировать форму и пользователь не мог нажать форму много раз. ↓
  let isLoading: boolean = false;

  // 96.2 Внутри же будет спец. метод Supabase для восстановления пароля. И ещё нам нужно указать путь, куда пользователь будет переходить после отправки формы восстановления пароля. Этот путь поменяется, когда мы зальём приложение на хостинг, т.ч. для удобства создадим в .env файле ещё одну запись "PUBLIC_URL" для домена сайта.
  // Go to [.env]
  // 96.4.1 Как мы уже делали раньше, переключаем "isLoading" на true вначале, а потом на false в конце функции. ↓
  const handleSubmit = async () => {
    isLoading = true;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.PUBLIC_URL}/reset-password`
    });

    if (error) {
      message = error.message;
      console.error(error);
    } else {
      message = 'Check your email for the password reset link!';
    }

    isLoading = false;
  };
</script>

<h1 class="auth-heading">Forgot Password</h1>

<!-- 96.1 Также по отправке формы мы будем запускать функцию "handleSubmit" -->
<!-- 96.3.1 Добавим также комп. Alert, который будет уведомлять пользователя. -->
<!-- 96.4.2 И наконец, используем знакомый трюк с тегом "fieldset", чтобы временно блокировать форму на время выполнения функции "handleSubmit". -->
<form on:submit|preventDefault={handleSubmit}>
  <Alert {message} />
  <fieldset disabled={isLoading}>
    <div class="field">
      <label class="text-goldenFizz" for="email">Email Address</label>
      <input
        bind:value={email}
        id="email"
        type="email"
        name="email"
        placeholder="Your Email"
        required
      />
    </div>
    <button class="auth-button center gap-x-4" type="submit">
      {#if isLoading}
        Loading... <Loader />
      {:else}
        Send me a Reset Email
      {/if}
    </button>
    <p class="mt-4 text-center text-sm text-white">
      <a class="underline hover:no-underline" href="/login">Remember your password? Log in!</a>
    </p>
  </fieldset>
</form>
