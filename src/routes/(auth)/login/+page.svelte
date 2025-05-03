<script lang="ts">
  let email: string;
  let password: string;
</script>

<h1 class="mb-4 text-[2.5rem] font-black text-goldenFizz">Login</h1>

<form>
  <div class="field">
    <label class="text-goldenFizz" for="email">Email Address</label>
    <input type="text" name="email" placeholder="Your Email" bind:value={email} />
  </div>

  <div class="field">
    <div class="flex justify-between">
      <label class="text-goldenFizz" for="password">Password</label>
      <a class="text-sm text-white underline hover:no-underline" href="/forgot-password"
        >Forgot password?</a
      >
    </div>
    <input type="password" name="password" placeholder="Your Password" bind:value={password} />
  </div>

  <div class="field">
    <button
      class="mt-6 min-h-[3.5rem] w-full rounded-lg bg-robinEggBlue py-3 px-4 text-xl font-bold text-daisyBush transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      type="submit">Log In</button
    >
    <p class="mt-4 text-center text-sm text-white">
      <a class="underline hover:no-underline" href="/signup">Don’t have an account yet? Sign up!</a>
    </p>
  </div>
</form>
