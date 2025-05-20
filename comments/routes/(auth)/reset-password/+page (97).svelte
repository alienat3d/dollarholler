<script lang="ts">
  import { goto } from '$app/navigation';
  import Alert from '$lib/components/Alert.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import supabase from '$lib/utils/supabase';

  // * 97.0 Здесь мы добавим функционал создания нового пароля пользователя после сброса. И здесь очень многое будет похоже на [src\routes\(auth)\forgot-password\+page.svelte], кроме записи нового пароля пользователя в БД Supabase.
  let newPassword: string = '';
  let confirmPassword: string = '';
  let message: string = '';
  let isLoading: boolean = false;

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      message = "Passwords don't match";
      isLoading = false;
      return;
    }

    isLoading = true;

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error(error);
      message = error.message;
    } else {
      message = 'Your password is successfully updated.';
    }

    isLoading = false;

    setTimeout(() => goto('/invoices'), 5000);
  };
</script>

<h1 class="auth-heading">Reset my Password</h1>

<Alert {message} />

<form on:submit|preventDefault={handleSubmit}>
  <fieldset disabled={isLoading}>
    <div class="field">
      <label class="text-goldenFizz" for="newPassword">New Password</label>
      <input
        bind:value={newPassword}
        id="newPassword"
        type="password"
        name="newPassword"
        required
      />
    </div>
    <div class="field">
      <label class="text-goldenFizz" for="confirmPassword">Confirm Password</label>
      <input
        bind:value={confirmPassword}
        id="confirmPassword"
        type="password"
        name="confirmPassword"
        required
      />
    </div>
    <button class="auth-button" type="submit">
      {#if isLoading}
        Loading... <Loader />
      {:else}
        Create a New Password
      {/if}
    </button>
    <p class="mt-4 text-center text-sm text-white">
      <a class="underline hover:no-underline" href="/login">Remember your password? Log in!</a>
    </p>
  </fieldset>
</form>
