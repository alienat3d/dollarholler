<script lang="ts">
  import { onMount } from 'svelte';
  import { settings, loadSettings, updateSettings } from '$lib/stores/SettingsStore';
  import { snackbar } from '$lib/stores/SnackbarStore';
  import supabase from '$lib/utils/supabase';
  import { states } from '$lib/utils/states';
  import { displayErrorMessage } from '$lib/utils/handleErrors';
  import Check from '$lib/components/Icon/Check.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Snackbar from '$lib/components/Snackbar.svelte';
  import Authenticated from '$lib/components/Authenticated.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import Alert from '$lib/components/Alert.svelte';

  let isInvoiceDetailsLoading: boolean = false;
  let isAccountInfoLoading: boolean = false;
  let isPasswordMatchWatch: boolean = false;

  let mySettings: Settings = {} as Settings;

  let newPassword: string = '';
  let confirmPassword: string = '';
  let accountEmail: string = '';
  let originalEmailValue: string = '';
  let message: string = '';

  const checkPasswordsMatch = () => {
    if (!isPasswordMatchWatch) return;

    if (newPassword !== confirmPassword) {
      message = "The passwords don't match.";
      return false;
    } else {
      message = '';
      return true;
    }
  };

  const handleInvoiceDetails = async () => {
    isInvoiceDetailsLoading = true;

    await updateSettings(mySettings);

    isInvoiceDetailsLoading = false;
  };

  const handleAccountInfo = async () => {
    isAccountInfoLoading = true;

    // if the email address hasn't changed or the password fields are empty
    if (accountEmail === originalEmailValue && !newPassword && !confirmPassword) {
      isAccountInfoLoading = false;

      snackbar.send({
        message: 'Please enter a new email address or password.',
        type: 'error'
      });

      return;
    }

    // if the user wants to update their email
    if (accountEmail !== originalEmailValue) {
      const { error } = await supabase.auth.updateUser({
        email: accountEmail
      });

      if (error) {
        isAccountInfoLoading = false;
        displayErrorMessage(error as Error);
        return;
      }

      snackbar.send({
        message: 'Check your email. Please confirm the change.',
        type: 'success'
      });

      accountEmail = originalEmailValue;
    }

    // if the user wants to update their password
    if (newPassword || confirmPassword) {
      // do the new password and confirm password match?
      if (newPassword !== confirmPassword) {
        message = "The passwords don't match.";
        isAccountInfoLoading = false;
        isPasswordMatchWatch = true;
        return;
      }
    }

    // update the password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      isAccountInfoLoading = false;
      displayErrorMessage(error as Error);
      return;
    }

    snackbar.send({
      message: 'Your password has been updated.',
      type: 'success'
    });

    isAccountInfoLoading = false;
  };

  onMount(async () => {
    await loadSettings();
    mySettings = { ...$settings };

    // get logged user
    const {
      data: { user }
    } = await supabase.auth.getUser();

    accountEmail = user?.email || '';

    originalEmailValue = accountEmail;
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

      <form on:submit|preventDefault={handleInvoiceDetails}>
        <fieldset
          class="grid grid-cols-6 gap-x-5"
          disabled={isInvoiceDetailsLoading || isAccountInfoLoading}
        >
          <div class="field col-span-6">
            <label for="myName">Name</label>
            <input bind:value={mySettings.myName} id="myName" type="text" name="myName" />
          </div>
          <div class="field col-span-6">
            <label for="invoiceEmail">Send Invoices from this Email</label>
            <input
              bind:value={mySettings.email}
              id="invoiceEmail"
              type="email"
              name="invoiceEmail"
            />
          </div>
          <div class="field col-span-6">
            <label for="street">Address</label>
            <input bind:value={mySettings.street} id="street" type="text" name="street" />
          </div>
          <div class="field col-span-6 md:col-span-2">
            <label for="city">City</label>
            <input bind:value={mySettings.city} id="city" type="text" name="city" />
          </div>
          <div class="field col-span-6 md:col-span-2">
            <label for="state">State</label>
            <select bind:value={mySettings.state} id="state" type="text" name="state">
              <option />
              {#each states as state}
                <option value={state.value}>{state.name}</option>
              {/each}
            </select>
          </div>
          <div class="field col-span-6 md:col-span-2">
            <label for="zip">Zip</label>
            <input bind:value={mySettings.zip} id="zip" type="text" name="zip" />
          </div>
          <div class="field col-span-6 flex justify-end">
            <button
              class="button center w-[200px] translate-y-0 bg-lavenderIndigo text-white shadow-colored transition-all hover:-translate-y-2 hover:shadow-coloredHover"
              type="submit"
            >
              {#if isInvoiceDetailsLoading}
                Loading... <span class="ml-2"><Loader /></span>
              {:else}
                <span class="mr-1"><Check /></span>Save
              {/if}
            </button>
          </div>
        </fieldset>
      </form>

      <div class="field relative col-span-6 mb-8">
        <h2>Update Account Information</h2>
        <p class="mb-2">This information is used to login to your account.</p>
        <Alert
          {message}
          className="absolute top-10 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 md:top-64 lg:top-[300px] xl:left-1/2 xl:-translate-x-1/2 bg-scarlet text-goldenFizz"
        />
      </div>

      <form on:submit|preventDefault={handleAccountInfo}>
        <fieldset
          class="grid grid-cols-6 gap-x-5"
          disabled={isAccountInfoLoading || isInvoiceDetailsLoading}
        >
          <div class="field col-span-6">
            <label for="email">Email Address</label>
            <input bind:value={accountEmail} id="email" type="email" name="email" />
          </div>
          <div class="field col-span-6 md:col-span-3">
            <label for="newPassword">New Password</label>
            <input
              bind:value={newPassword}
              on:input={checkPasswordsMatch}
              id="newPassword"
              type="password"
              name="newPassword"
            />
          </div>
          <div class="field col-span-6 md:col-span-3">
            <label for="confirmPassword">Confirm Password</label>
            <input
              bind:value={confirmPassword}
              on:input={checkPasswordsMatch}
              id="confirmPassword"
              type="password"
              name="confirmPassword"
            />
          </div>
          <div class="field col-span-6 flex justify-end">
            <button
              class="button center w-[200px] translate-y-0 bg-lavenderIndigo text-white shadow-colored transition-all hover:-translate-y-2 hover:shadow-coloredHover"
              type="submit"
            >
              {#if isAccountInfoLoading}
                Loading... <span class="ml-2"><Loader /></span>
              {:else}
                <span class="mr-1"><Check /></span>Save
              {/if}
            </button>
          </div>
        </fieldset>
      </form>
    </main>
  </div>
</Authenticated>

<style lang="postcss">
  h2 {
    @apply mb-1 text-3xl font-black text-daisyBush;
  }
</style>
