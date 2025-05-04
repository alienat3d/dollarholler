<script lang="ts"></script>

<h1 class="auth-heading">Sign Up</h1>

<form>
  <div class="field">
    <label class="text-goldenFizz" for="fullName">Full Name</label>
    <input type="text" name="fullName" required />
  </div>

  <div class="field">
    <label class="text-goldenFizz" for="email">Email Address</label>
    <input type="email" name="email" required />
  </div>

  <div class="field">
    <label class="text-goldenFizz" for="password">Password</label>
    <input type="password" name="password" required />
  </div>

  <div class="field">
    <label class="text-goldenFizz" for="confirmPassword">Confirm Password</label>
    <input type="password" name="confirmPassword" required />
  </div>

  <button class="auth-button" type="submit">Sign Up</button>
  <p class="mt-4 text-center text-sm text-white">
    <a class="underline hover:no-underline" href="/login">Already have an account? Log in!</a>
  </p>
</form>
