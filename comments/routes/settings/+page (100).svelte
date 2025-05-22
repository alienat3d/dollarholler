<script lang="ts">
  import { onMount } from 'svelte';
  import { settings, loadSettings } from '$lib/stores/SettingsStore';
  import supabase from '$lib/utils/supabase';
  import { states } from '$lib/utils/states';
  import Check from '$lib/components/Icon/Check.svelte';
  import Button from '$lib/components/Button.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Snackbar from '$lib/components/Snackbar.svelte';
  import Authenticated from '$lib/components/Authenticated.svelte';

  let mySettings: Settings = {} as Settings;
  let accountEmail: string = '';

  // 100.1 Возьмём из доки метод, который будет получать пользователя: "User management -> GET USER". Далее мы поместим в переменную "accountEmail" адрес эл. почты, полученный из объекта "user" этим методом. ↓
  onMount(async () => {
    await loadSettings();
    mySettings = { ...$settings };

    // get logged user
    const {
      data: { user }
    } = await supabase.auth.getUser();

    accountEmail = user?.email || '';
  });
</script>

<Authenticated>
  <div class="grid min-h-screen grid-cols-12 bg-whisper md:gap-x-16">
    <Snackbar />
    <Navbar />
    <main
      class="col-span-12 px-4 pt-4 md:col-span-8 md:col-start-4 md:pt-20 lg:col-span-6 lg:col-start-5"
    >
      <h2>Invoice Details</h2>
      <p class="mb-8">This information gets included on each invoice.</p>

      <form class="grid grid-cols-6 gap-x-5">
        <div class="field col-span-6">
          <label for="myName">Name</label>
          <input id="myName" type="text" name="myName" bind:value={mySettings.myName} />
        </div>

        <div class="field col-span-6">
          <label for="invoiceEmail">Send Invoices from this Email</label>
          <input id="invoiceEmail" type="email" name="invoiceEmail" bind:value={mySettings.email} />
        </div>

        <div class="field col-span-6">
          <label for="street">Address</label>
          <input id="street" type="text" name="street" bind:value={mySettings.street} />
        </div>

        <div class="field col-span-6 md:col-span-2">
          <label for="city">City</label>
          <input id="city" type="text" name="city" bind:value={mySettings.city} />
        </div>

        <div class="field col-span-6 md:col-span-2">
          <label for="state">State</label>
          <select id="state" type="text" name="state" bind:value={mySettings.state}>
            <option />
            {#each states as state}
              <option value={state.value}>{state.name}</option>
            {/each}
          </select>
        </div>

        <div class="field col-span-6 md:col-span-2">
          <label for="zip">Zip</label>
          <input id="zip" type="text" name="zip" bind:value={mySettings.zip} />
        </div>

        <div class="field col-span-6 flex justify-end">
          <Button label="Save" iconLeft={Check} onClick={() => {}} />
        </div>
      </form>

      <div class="field col-span-6">
        <h2>Update Account Information</h2>
        <p class="mb-8">This information is used to login to your account.</p>
      </div>

      <!-- 100.2 Теперь привяжем значение "accountEmail" к этому инпуту. -->
      <form class="grid grid-cols-6 gap-x-5">
        <div class="field col-span-6 md:col-span-3">
          <label for="email">Email Address</label>
          <input bind:value={accountEmail} id="email" type="email" name="email" />
        </div>

        <div class="field col-span-6 md:col-span-3">
          <label for="currentPassword">Current Password</label>
          <input id="currentPassword" type="password" name="currentPassword" />
        </div>

        <div class="field col-span-6 md:col-span-3">
          <label for="newPassword">New Password</label>
          <input id="newPassword" type="password" name="newPassword" />
        </div>

        <div class="field col-span-6 md:col-span-3">
          <label for="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="password" name="confirmPassword" />
        </div>

        <div class="field col-span-6 flex justify-end">
          <Button label="Save" iconLeft={Check} onClick={() => {}} />
        </div>
      </form>
    </main>
  </div>
</Authenticated>

<style lang="postcss">
  h2 {
    @apply mb-1 text-3xl font-black text-daisyBush;
  }
</style>
