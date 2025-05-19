<script lang="ts">
  import { goto } from '$app/navigation';
  import supabase from '$lib/utils/supabase';
  import Alert from '$lib/components/Alert.svelte';
  import Loader from '$lib/components/Loader.svelte';

  let email: string;
  let password: string;
  // let alertMessage: string = "You've successfully logged out!";
  let message: string = '';
  let isLoading: boolean = false;

  // 92.1 А здесь уже опишем её. В доках по "User Management" находим кусочек кода для логина с имейлом и паролем. А остальное будет очень похожим на предыдущий урок, где мы сделали функционал для регистрации новых пользователей. Добавим переменные для email & password, а затем их содержимое в метод "signInWithPassword" для логина.
  // 92.2 Также у нас будет проверка на ошибку и если таковая найдена, то она будет выводиться в комп. "Alert" и консоль.
  // 92.3 Нам также пригодится состояние загрузки, которое будет также в переменной "isLoading". ↓
  // 92.6 Ну, и если процесс логина прошёл успешно, то нам нужно редиректить пользователя на страницу списка инвойсов методом "goto".
  const handleSubmit = async () => {
    isLoading = true;
    message = '';
    let { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error(error.message);
      message = error.message;
      isLoading = false;
      return;
    } else {
      goto('/invoices');
    }

    isLoading = false;
  };
</script>

<h1 class="auth-heading">Login</h1>

<!-- * 92.0 Создаём функцию для логина. Сперва вешаем слушатель на "submit", который запустит "handleSubmit". ↑ -->
<!-- 92.4 Также, как и в случае со страницей SignUp мы обернём строки ввода в fieldset и будем ставить ему атрибут "disabled", когда isLoading в положении "true". -->
<!-- 92.5 Также добавим лоадер в кнопку, как и на странице "signup". ↑ -->
<form on:submit|preventDefault={handleSubmit}>
  <Alert {message} />
  <fieldset disabled={isLoading}>
    <div class="field">
      <label class="text-goldenFizz" for="email">Email Address</label>
      <input type="text" name="email" placeholder="Your Email" bind:value={email} required />
    </div>
    <div class="field">
      <div class="flex justify-between">
        <label class="text-goldenFizz" for="password">Password</label>
        <a class="text-sm text-white underline hover:no-underline" href="/forgot-password"
          >Forgot password?</a
        >
      </div>
      <input
        type="password"
        name="password"
        placeholder="Your Password"
        bind:value={password}
        required
      />
    </div>
    <div class="field">
      <button class="auth-button center gap-x-4" type="submit">
        {#if isLoading}
          Loading... <Loader />
        {:else}
          Log In
        {/if}
      </button>
      <p class="mt-4 text-center text-sm text-white">
        <a class="underline hover:no-underline" href="/signup"
          >Don’t have an account yet? Sign up!</a
        >
      </p>
    </div>
  </fieldset>
</form>
