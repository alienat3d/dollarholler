<script lang="ts">
  import { onMount } from 'svelte';
  import { settings, loadSettings } from '$lib/stores/SettingsStore';
  import { states } from '$lib/utils/states';
  import Check from '$lib/components/Icon/Check.svelte';
  import Button from '$lib/components/Button.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Snackbar from '$lib/components/Snackbar.svelte';

  // 58.2 создадим переменную mySettings, чтобы загружать туда данные из хранилища. Пока присвоим ей пустой объект с типом "Settings".
  let mySettings: Settings = {} as Settings;

  // 58.3 Загружаем данные с "loadSettings" при загрузке страницы, а после этого присваиваем содержимое хранилища "$settings" в переменную "mySettings".
  onMount(() => {
    loadSettings();
    mySettings = { ...$settings };
  });
</script>

<!-- * 58.0 Здесь мы сверстаем страницу настроек, где пользователь сможет ввести персональную информацию о себе, а также поменять свой пароль от аккаунта. -->
<div class="grid min-h-screen grid-cols-12 bg-whisper md:gap-x-16">
  <Snackbar />
  <Navbar />
  <main
    class="col-span-12 px-4 pt-4 md:col-span-8 md:col-start-4 md:pt-20 lg:col-span-6 lg:col-start-5"
  >
    <h2>Invoice Details</h2>
    <p class="mb-8">This information gets included on each invoice.</p>

    <!-- 58.4 Теперь нужно пройтись по всем инпутам и привязать их к mySettings. -->
    <form class="grid grid-cols-6 gap-x-5">
      <div class="field col-span-6">
        <label for="name">Name</label>
        <input type="text" name="name" bind:value={mySettings.name} />
      </div>

      <div class="field col-span-6">
        <label for="street">Address</label>
        <input type="text" name="street" bind:value={mySettings.street} />
      </div>

      <div class="field col-span-6 md:col-span-2">
        <label for="city">City</label>
        <input type="text" name="city" bind:value={mySettings.city} />
      </div>

      <div class="field col-span-6 md:col-span-2">
        <label for="state">State</label>
        <select type="text" name="state" bind:value={mySettings.state}>
          <option />
          {#each states as state}
            <option value={state.value}>{state.name}</option>
          {/each}
        </select>
      </div>

      <div class="field col-span-6 md:col-span-2">
        <label for="zip">Zip</label>
        <input type="text" name="zip" bind:value={mySettings.zip} />
      </div>

      <div class="field col-span-6 flex justify-end">
        <Button label="Save" iconLeft={Check} onClick={() => {}} />
      </div>
    </form>

    <div class="field col-span-6">
      <h2>Update Account Information</h2>
      <p class="mb-8">This information is used to access to your account.</p>
    </div>

    <!-- 58.1 С точки зрения UX мы не хотим объединять смену пароля с формой выше и, для удобства пользователей, разделим их на две формы. ↑ -->
    <form class="grid grid-cols-6 gap-x-5">
      <div class="field col-span-6 md:col-span-3">
        <label for="email">Email Address</label>
        <input type="email" name="email" />
      </div>

      <div class="field col-span-6 md:col-span-3">
        <label for="currentPassword">Current Password</label>
        <input type="password" name="currentPassword" />
      </div>

      <div class="field col-span-6 md:col-span-3">
        <label for="newPassword">New Password</label>
        <input type="password" name="newPassword" />
      </div>

      <div class="field col-span-6 md:col-span-3">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" name="confirmPassword" />
      </div>

      <div class="field col-span-6 flex justify-end">
        <Button label="Save" iconLeft={Check} onClick={() => {}} />
      </div>
    </form>
  </main>
</div>

<style lang="postcss">
  h2 {
    @apply mb-1 text-3xl font-black text-daisyBush;
  }
</style>
