<!-- ? Шаблон для динамически генерируемых страниц индивидуального инвойса -->
<script lang="ts">
  import Button from '$lib/components/Button.svelte';

  const printInvoice = () => {
    console.log('print invoice');
  };

  const copyLink = () => {
    console.log('copy link');
  };

  const sendInvoice = () => {
    console.log('send invoice');
  };

  const payInvoice = () => {
    console.log('pay invoice');
  };
</script>

<div class="fixed z-0 mb-16 flex w-full max-w-screen-lg justify-between">
  <h1 class="text-3xl font-bold text-daisyBush">Invoice</h1>
  <div class="flex items-center gap-4">
    <Button
      height="short"
      label="Print"
      style="outline"
      isAnimated={false}
      onClick={printInvoice}
    />
    <Button height="short" label="Copy Link" onClick={copyLink} />
    <Button height="short" label="Send" onClick={sendInvoice} />
    <Button height="short" label="Pay Invoice" onClick={payInvoice} />
  </div>
</div>

<div
  class="relative top-32 z-10 grid grid-cols-6 gap-x-5 gap-y-8 bg-white py-16 px-32 shadow-slidePanel"
>
  <div class="col-span-3">
    <img
      src="/images/logo.png"
      srcset="/images/logo@2x.png 2x, /images/logo.png 1x"
      alt="Compressed.fm Logo"
    />
  </div>

  <div class="col-span-2 col-start-5 pt-4">
    <div class="label">From</div>
    <p>
      Al Zaplin<br />
      123 Main Street<br />
      Pigeon Forge, TN 54321
    </p>
  </div>

  <div class="col-span-3">
    <div class="label">Bill To:</div>
    <p>
      <strong>Sitecenter</strong><br />
      admin@sitecenter.org<br />
      789 Stellar Street<br />
      Palm Springs, CA 12345
    </p>
  </div>

  <div class="col-span-2 col-start-5">
    <div class="label">Invoice ID</div>
    <p>123459</p>
  </div>

  <div class="col-span-3">
    <div class="label">Due Date</div>
    <p>6 / 11 / 2025</p>
  </div>

  <div class="col-span-2 col-start-5">
    <div class="label">Issue Date</div>
    <p>4 / 30 / 2025</p>
  </div>

  <div class="col-span-6">
    <div class="label">Subject</div>
    <p>Website</p>
  </div>

  <div class="col-span-6">
    <!-- Line Items -->
  </div>

  <div class="col-span-6">
    <div class="label">Notes</div>
    <p>Lorem ipsum dolor sit amet.</p>
  </div>

  <div class="col-span-6">
    <div class="label">Terms and Conditions</div>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, esse.</p>
  </div>
</div>

<style lang="postcss">
  .label {
    @apply font-black text-monsoon;
  }
</style>
