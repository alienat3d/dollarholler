<script lang="ts">
  import supabase from '$lib/utils/supabase';
  import Alert from '$lib/components/Alert.svelte';
  import Loader from '$lib/components/Loader.svelte';

  let fullName: string;
  let email: string;
  let password: string;
  let confirmPassword: string;
  let message: string = '';
  let isSignupFormShowing: boolean = true;
  let isLoading: boolean = false;

  const handleSubmit = async () => {
    message = '';
    isLoading = true;

    // make sure that the password and the confirm password match
    if (password !== confirmPassword) {
      message = "Your password and confirm password don't match.";
      isLoading = false;
      return;
    }

    // signing up the user
    let userResults = await supabase.auth.signUp({ email, password });

    if (userResults.error) {
      message = userResults.error.message;
      console.error(userResults.error);
      isLoading = false;
      return;
    }

    // add the full name to the settings table
    if (userResults?.data?.user?.id) {
      const settingsResults = await supabase
        .from('settings')
        .insert([{ myName: fullName, email, userId: userResults.data.user.id }]);

      if (settingsResults.error) {
        message = settingsResults.error.message;
        console.error(settingsResults.error);
        isLoading = false;
        return;
      }
    }

    isSignupFormShowing = false;
    isLoading = false;
  };
</script>

{#if isSignupFormShowing}
  <h1 class="auth-heading">Sign Up</h1>

  <Alert {message} />

  <form on:submit|preventDefault={handleSubmit}>
    <fieldset disabled={isLoading}>
      <div class="field">
        <label class="text-goldenFizz" for="fullName">Full Name</label>
        <input bind:value={fullName} id="fullName" type="text" name="fullName" required />
      </div>
      <div class="field">
        <label class="text-goldenFizz" for="email">Email Address</label>
        <input
          bind:value={email}
          id="email"
          type="email"
          name="email"
          required
          autocomplete="email"
        />
      </div>
      <div class="field">
        <label class="text-goldenFizz" for="password">Password</label>
        <input bind:value={password} id="password" type="password" name="password" required />
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
      <button class="auth-button center gap-x-4" type="submit">
        {#if isLoading}
          Loading... <Loader />
        {:else}
          Sign Up
        {/if}
      </button>
      <p class="mt-4 text-center text-sm text-white">
        <a class="underline hover:no-underline" href="/login">Already have an account? Log in!</a>
      </p>
    </fieldset>
  </form>
{:else}
  <Alert message="Check your email for the confirmation link." />
  <a class="auth-button block text-center" href="/login">Login</a>
{/if}
