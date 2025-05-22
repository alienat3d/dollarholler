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

  // * 101.0 Итак, у нас тут две независимые друг от друга формы, и нам нужно блокировать форму во время её отправки, чтобы предотвратить многократную отсылку, а также блокировать другую форму тоже. Создадим для этого ещё две переменные-переключатели. ↓
  let isInvoiceDetailsLoading: boolean = false;
  let isAccountInfoLoading: boolean = false;
  let isPasswordMatchWatch: boolean = false;

  let mySettings: Settings = {} as Settings;

  let newPassword: string = '';
  let confirmPassword: string = '';
  let accountEmail: string = '';
  // 101.10.0 В целом, для удобства пользователя лучше было бы сделать, чтобы можно было бы обновлять email без того, чтобы вводить пароль. Создадим для этого ещё одну переменную "originalEmailValue". ↓
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

  // 101.2.1 ... которая будет изменять данные профиля пользователя.
  // 101.8 Теперь используем этот метод "updateSettings" из хранилища здесь и переключим "isInvoiceDetailsLoading" в положение true в начале функции и снова в false в конце. ↓
  const handleInvoiceDetails = async () => {
    isInvoiceDetailsLoading = true;

    await updateSettings(mySettings);

    isInvoiceDetailsLoading = false;
  };

  // 101.3 Тоже самое сделаем и для второй формы, создав для неё функцию, которая будет обновлять пароль для аккаунта пользователя.
  // Go to [src\lib\stores\SettingsStore.ts]
  // // 101.10.2 Сделаем проверки и если пройдут, то переключаем состояние загрузки, уведомим пользователя, что ему нужно сперва что-то ввести, прежде, чем тыкать кнопку и выходим из функции.
  // 101.11 Теперь перейдём к обновлению данных аккаунта, в случае, если проверка перед этим была не пройдена. Для этого из доки "User Management -> Update User" возьмём метод "updateUser".
  // 101.12 В случае же, если строки ввода паролей не пусты, то мы будем проводить проверку соответствия данных обоих инпутов паролей и в случае отличий выводить сообщение, но в этот раз через комп. Alert.
  // 101.13 Но, если условие не сработало, то мы обновляем пароль.
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

  // 101.10.1 Дальше значение "accountEmail" будет присвоено "originalEmailValue".
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

      <!-- 101.1.0 Как и раньше, в случае со страницами логина, сброса и смены пароля, мы обернём инпуты формы в <fieldset>. -->
      <!-- 101.2.0 Создадим слушатель события "submit", который будет запускать функцию "handleInvoiceDetails"... -->
      <form on:submit|preventDefault={handleInvoiceDetails}>
        <fieldset
          class="grid grid-cols-6 gap-x-5"
          disabled={isInvoiceDetailsLoading || isAccountInfoLoading}
        >
          <div class="field col-span-6">
            <label for="myName">Name</label>
            <input id="myName" type="text" name="myName" bind:value={mySettings.myName} />
          </div>
          <div class="field col-span-6">
            <label for="invoiceEmail">Send Invoices from this Email</label>
            <input
              id="invoiceEmail"
              type="email"
              name="invoiceEmail"
              bind:value={mySettings.email}
            />
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

      <!-- 101.1.1 Тоже самое сделаем и со второй формой и будем блокировать все инпуты через него, как только значение переменных сменится на true. -->
      <!-- 101.9 Теперь, для этой формы нам нужно забиндить все оставшиеся инпуты к своим переменным. ↑ -->
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
