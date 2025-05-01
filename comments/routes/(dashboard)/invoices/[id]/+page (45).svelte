<!-- ? Шаблон для динамически генерируемых страниц индивидуального инвойса -->
<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown';

  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { settings, loadSettings } from '$lib/stores/SettingsStore';
  import { convertDate } from '$lib/utils/dateHelpers';
  import Button from '$lib/components/Button.svelte';
  import LineItemRows from '../LineItemRows.svelte';

  export let data: { invoice: Invoice };

  // 45.1 Также создадим специальную переменную, которая будет содержать название кнопки по умолчанию "Copy Link" и передадим её внизу кнопке.
  let copyLinkLabel = 'Copy Link';

  const printInvoice = () => window.print();

  // * 45.0 Теперь сделаем функционал кнопки "Copy Link", чтобы можно было скопировать ссылку на текущую страницу. Сделать это можно с помощью браузерного API. И внутрь метода "writeText" нам нужно поместить ссылку, которую мы хотим отправить в пользовательский буфер обмена. А доступ к текущему URL можно получить, через встроенное в Svelte хранилище $Page.
  // 45.2 Ну и для наглядности мы будем менять на 5 сек. текст кнопки на "Copied!", чтобы дать пользователю понять, что ссылка успешно скопирована.
  const copyLink = () => {
    navigator.clipboard.writeText($page.url.href);
    copyLinkLabel = 'Copied!';
    setTimeout(() => (copyLinkLabel = 'Copy Link'), 5000);
  };

  const sendInvoice = () => {
    console.log('send invoice');
  };

  const payInvoice = () => {
    console.log('pay invoice');
  };

  onMount(() => {
    loadSettings();
  });
</script>

<div class="fixed z-0 mb-16 flex w-full max-w-screen-lg justify-between print:hidden">
  <h1 class="text-3xl font-bold text-daisyBush">Invoice</h1>
  <!-- 45.3.0 Чтобы кнопка не "прыгала" при переключении текста нам нужно ещё добавить пару стилей и для этого добавить ещё один проп "className". -->
  <!-- Go to [src\lib\components\Button.svelte] -->
  <div class="flex items-center gap-4">
    <Button
      height="short"
      label="Print"
      style="outline"
      isAnimated={false}
      onClick={printInvoice}
    />
    <Button
      height="short"
      label={copyLinkLabel}
      className="min-w-[169px] justify-center"
      onClick={copyLink}
    />
    <Button height="short" label="Send" onClick={sendInvoice} />
    <Button height="short" label="Pay Invoice" onClick={payInvoice} />
  </div>
</div>

<div
  class="relative top-32 z-10 grid grid-cols-6 gap-x-5 gap-y-8 bg-white py-16 px-32 shadow-slidePanel print:top-0 print:shadow-none"
>
  <div class="col-span-3">
    <img
      src="/images/logo.png"
      srcset="/images/logo@2x.png 2x, /images/logo.png 1x"
      alt="Compressed.fm Logo"
    />
  </div>

  <div class="col-span-2 col-start-5 pt-4">
    {#if $settings && $settings.name}
      <div class="label">From</div>
      <p>
        {$settings.name}<br />
        {#if $settings.street && $settings.city && $settings.state && $settings.zip}
          {$settings.street}<br />
          {$settings.city}, {$settings.state}
          {$settings.zip}
        {/if}
      </p>
    {:else}
      <div class="center min-h-[68px] rounded bg-gallery">
        <a class="text-stone-600 underline hover:no-underline" href="/settings"
          >Add your contact information.</a
        >
      </div>
    {/if}
  </div>

  <div class="col-span-3">
    <div class="label">Bill To:</div>
    <p>
      <strong>{data.invoice.client.name}</strong><br />
      {data.invoice.client.email}<br />
      {data.invoice.client.street}<br />
      {data.invoice.client.city}, {data.invoice.client.state}
      {data.invoice.client.zip}
    </p>
  </div>

  <div class="col-span-2 col-start-5">
    <div class="label">Invoice ID</div>
    <p>{data.invoice.invoiceNumber}</p>
  </div>

  <div class="col-span-3">
    <div class="label">Due Date</div>
    <p>{convertDate(data.invoice.dueDate)}</p>
  </div>

  <div class="col-span-2 col-start-5">
    <div class="label">Issue Date</div>
    <p>{convertDate(data.invoice.issueDate)}</p>
  </div>

  <div class="col-span-6">
    <div class="label">Subject</div>
    <p>{data.invoice.subject}</p>
  </div>

  <div class="col-span-6">
    <LineItemRows
      lineItems={data.invoice.lineItems}
      isEditable={false}
      discount={data?.invoice?.discount || 0}
    />
  </div>

  {#if data.invoice.notes}
    <div class="col-span-6">
      <div class="label">Notes</div>
      <SvelteMarkdown source={data.invoice.notes} />
    </div>
  {/if}

  {#if data.invoice.terms}
    <div class="col-span-6">
      <div class="label">Terms and Conditions</div>
      <SvelteMarkdown source={data.invoice.terms} />
    </div>
  {/if}
</div>

<style lang="postcss">
  .label {
    @apply font-black text-monsoon;
  }
</style>
