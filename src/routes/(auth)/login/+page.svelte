<script lang="ts">
  import Alert from '$lib/components/Alert.svelte';

  let email: string;
  let password: string;
  // let alertMessage: string = "You've successfully logged out!";
  let alertMessage: string = '';
</script>

<h1 class="auth-heading">Login</h1>

<form>
  <Alert message={alertMessage} />
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
    <button class="auth-button" type="submit">Log In</button>
    <p class="mt-4 text-center text-sm text-white">
      <a class="underline hover:no-underline" href="/signup">Don’t have an account yet? Sign up!</a>
    </p>
  </div>
</form>
