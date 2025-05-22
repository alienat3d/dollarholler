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

  let copyLinkLabel = 'Copy Link';

  const printInvoice = () => window.print();

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

<div
  class="fixed z-0 mb-16 flex w-full max-w-screen-lg flex-col justify-between gap-y-5 px-4 print:hidden md:flex-row lg:px-0"
>
  <h1 class="text-3xl font-bold text-daisyBush">Invoice</h1>
  <div class="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-4">
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
      className="sm:min-w-[169px] min-w-[111px] justify-center"
      onClick={copyLink}
    />
    <Button height="short" label="Send" onClick={sendInvoice} />
    <Button height="short" label="Pay Invoice" onClick={payInvoice} />
  </div>
</div>

<div
  class="relative top-32 z-10 grid grid-cols-6 gap-x-5 gap-y-8 bg-white py-8 px-5 shadow-slidePanel print:top-0 print:py-0 print:shadow-none md:py-16 md:px-32"
>
  <div class="col-span-6 print:col-span-3 sm:col-span-3">
    <img
      src="/images/logo.png"
      srcset="/images/logo@2x.png 2x, /images/logo.png 1x"
      alt="Compressed.fm Logo"
    />
  </div>

  <div class="col-span-6 pt-4 print:col-span-3 sm:col-span-2 sm:col-start-5">
    {#if $settings && $settings.myName}
      <div class="label">From</div>
      <p>
        {$settings.myName}<br />
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

  <div class="col-span-6 print:col-span-3 sm:col-span-3">
    <div class="label">Bill To:</div>
    <p>
      {#if data.invoice.client.name}<strong>{data.invoice.client.name}</strong><br />{/if}
      {#if data.invoice.client.email}{data.invoice.client.email}<br />{/if}
      {#if data.invoice.client.street}{data.invoice.client.street}<br />{/if}
      {#if data.invoice.client.city}{data.invoice.client.city}, {/if}
      {#if data.invoice.client.state}{data.invoice.client.state}{/if}
      {#if data.invoice.client.zip}{data.invoice.client.zip}{/if}
    </p>
  </div>

  <div class="col-span-6 sm:col-span-2 sm:col-start-5">
    <div class="label">Invoice ID</div>
    <p>{data.invoice.invoiceNumber}</p>
  </div>

  <div class="col-span-3">
    <div class="label">Due Date</div>
    <p>{convertDate(data.invoice.dueDate)}</p>
  </div>

  <div class="col-span-3 sm:col-span-2 sm:col-start-5">
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
