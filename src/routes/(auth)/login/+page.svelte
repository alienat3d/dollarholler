<script lang="ts">
  import { goto } from '$app/navigation';
  import supabase from '$lib/utils/supabase';
  import Alert from '$lib/components/Alert.svelte';
  import Loader from '$lib/components/Loader.svelte';

  let email: string;
  let password: string;
  let message: string = '';
  let isLoading: boolean = false;

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

<form on:submit|preventDefault={handleSubmit}>
  <Alert {message} />
  <fieldset disabled={isLoading}>
    <div class="field">
      <label class="text-goldenFizz" for="email">Email Address</label>
      <input
        bind:value={email}
        id="email"
        type="text"
        name="email"
        placeholder="Your Email"
        required
      />
    </div>
    <div class="field">
      <div class="flex justify-between">
        <label class="text-goldenFizz" for="password">Password</label>
        <a class="text-sm text-white underline hover:no-underline" href="/forgot-password"
          >Forgot password?</a
        >
      </div>
      <input
        bind:value={password}
        id="password"
        type="password"
        name="password"
        placeholder="Your Password"
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
