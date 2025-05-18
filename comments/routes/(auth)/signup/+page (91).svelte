<script lang="ts">
  import supabase from '$lib/utils/supabase';
  import Alert from '$lib/components/Alert.svelte';
  import Loader from '$lib/components/Loader.svelte';

  // 91.2 Очевидно, чтобы зарегистрировать нового пользователя — надо сперва собрать эти данные из формы в переменные.
  let fullName: string;
  let email: string;
  let password: string;
  let confirmPassword: string;
  let message: string = '';
  // 91.6.0 Нам нужно также оповещать пользователей об успешной регистрации, для этого создадим ещё одну переменную, которая будет содержать булево значение. ↓
  let isSignupFormShowing: boolean = true;
  // 91.7.1 Для этого понадобится ещё одна переменная с булевым значением. ↓
  let isLoading: boolean = false;

  // * 91.0 Займёмся теперь авторизацией, нам нужно связать нашу вёрстку страницы signup с Supabase. Для этого подсмотрим в доках специальный метод "signUp", который этим будет заниматься и поместим в эту функцию.
  // 91.3 Затем, мы передадим содержимое "email" & "password" в объект для регистрации методом "signUp".
  // 91.4 Однако, прежде, чем регистрировать, нам нужно ещё проверять, что поле "password" совпадает с полем "confirmPassword" и выводить сообщение, если нет.
  // 91.5 Следующее, что нужно сделать, это проверять на ошибки во время регистрации пользователя в Supabase.
  // 91.6.3 Ну, а если ни одна из проверок не сработала и регистрация прошла успешно, то меняем состояние страницы.
  // 91.6.4 Нам следует также удалять сообщение, чтобы убедиться, что ничего не осталось с прошлой неудачной регистрации при повторной попытке.
  // 91.7.0 Также нам нужно продумать случай, если у пользователя действительно медленное интернет соединение и чтобы, кликнув один раз по кнопке "Sign Up", пока соединение с Supabase грузится, он не мог кликать по ней снова и снова, думая, что первый раз не вышло, мы сделаем состояние загрузки и будем блокировать форму во время этого состояния.
  // 91.7.2 Итак, как только прошло событие "submit" и запустилась функция "handleSubmit" мы переключим isLoading в true, также учтём это в проверках внутри и разблокируем форму в конце функции. ↓
  // 91.10 Теперь у нас осталось только поле Full Name, но проблема в том, что во встроенной аутентификации Supabase такого поля не предусмотренно и добавить его нет возможности, поэтому мы и создавали отдельную таблицу, чтобы расширить данные о пользователе. Итак, нам нужно связать две таблицы auth и settings вместе. Но, для начала, немного рефакторинга. Мы поменяем стандартный подход реструктурирования и создадим переменную "userResults", а далее займёмся добавлением данных из Full Name в таблицу "settings". Напишем условие, что если есть id пользователя, то мы добавим новую строку в табл. "settings". Далее в доках найдём, "insert row" для табл. "settings" и поместим в неё "myName" со значением инпута Full Name, "email" и "userId" только что созданного пользователя для связки.
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

<!-- 91.6.1 А дальше при помощи условия будем показывать либо форму регистрации, либо... -->
{#if isSignupFormShowing}
  <h1 class="auth-heading">Sign Up</h1>

  <Alert {message} />

  <!-- 91.1 Также нужно привязать форму к функции "handleSubmit" и сделаем это с помощью слушателя события "submit", не забывая про модификатор "preventDefault". -->
  <!-- 91.8 Теперь перейдём к блокированию формы во время состояния загрузки. Для этого нам требуется заблокировать все строки формы (к сожалению, нельзя заблокировать саму форму) и кнопку отправки формы. Но мы можем упростить себе задачу, обернув все строки ввода в тег fieldset, который используется в HTML для логической группировки строк ввода. Теперь, имея этот тег родителем всех остальных мы можем блокировать его. -->
  <!-- 91.9.0 Нам нужно также сообщить пользователю, что форма перешла в режим загрузки и заблокирована. Для этого создадим ещё один комп. [src\lib\components\Loader.svelte]. ↓ -->
  <form on:submit|preventDefault={handleSubmit}>
    <fieldset disabled={isLoading}>
      <div class="field">
        <label class="text-goldenFizz" for="fullName">Full Name</label>
        <input id="fullName" type="text" name="fullName" required bind:value={fullName} />
      </div>
      <div class="field">
        <label class="text-goldenFizz" for="email">Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          bind:value={email}
          autocomplete="email"
        />
      </div>
      <div class="field">
        <label class="text-goldenFizz" for="password">Password</label>
        <input id="password" type="password" name="password" required bind:value={password} />
      </div>
      <div class="field">
        <label class="text-goldenFizz" for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          required
          bind:value={confirmPassword}
        />
      </div>
      <!-- 91.9.1 А дальше с условием вставим его в кнопку "Sign Up". -->
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
  <!-- 91.6.2 ...сообщение о том, что пользователю следует подтвердить регистрацию аккаунта на его эл. почте со ссылкой на страницу логина. ↑ -->
{:else}
  <Alert message="Check your email for the confirmation link." />
  <a class="auth-button block text-center" href="/login">Login</a>
{/if}
