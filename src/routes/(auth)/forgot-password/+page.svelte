<script lang="ts">
  import { env } from '$env/dynamic/public';
  import supabase from '$lib/utils/supabase';
  import Alert from '$lib/components/Alert.svelte';
  import Loader from '$lib/components/Loader.svelte';

  let email: string = '';
  let message: string = '';
  let isLoading: boolean = false;

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
